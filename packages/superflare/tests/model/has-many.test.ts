import Database, { type Database as DatabaseType } from "better-sqlite3";
import { beforeEach, expect, it } from "vitest";
import { config } from "../../src/config";
import { Model } from "../../src/model";
import type { BaseModel } from "../../index.types";
import { createD1Database } from "../../cli/d1-database";

let ModelConstructor = Model as unknown as BaseModel;

class Post extends ModelConstructor {
  id!: number;
  text!: string;
  createdAt!: string;
  updatedAt!: string;
  userId!: number;
}

class User extends ModelConstructor {
  id!: number;
  name!: string;
  createdAt!: string;
  updatedAt!: string;
  profileId?: number;

  posts?: Post[] | Promise<Post[]>;
  $posts() {
    return this.hasMany(Post);
  }
}

function refreshDatabase(database: DatabaseType) {
  database.exec(`
    DROP TABLE IF EXISTS posts;
    CREATE TABLE posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      userId INTEGER NOT NULL,
      createdAt timestamp not null default current_timestamp,
      updatedAt timestamp not null default current_timestamp
    );

    DROP TABLE IF EXISTS users;
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      createdAt timestamp not null default current_timestamp,
      updatedAt timestamp not null default current_timestamp
    );
  `);

  return database;
}

const sqliteDb = new Database(":memory:");
const database = createD1Database(sqliteDb);

beforeEach(async () => {
  refreshDatabase(sqliteDb);
  config({
    database: {
      default: database,
    },
  });
});

it("works", async () => {
  const user = await User.create({
    name: "John Doe",
  });
  await Post.create({
    text: "Hello World",
    userId: user.id,
  });
  await Post.create({
    text: "Hello again",
    userId: user.id,
  });

  const posts = await user.posts;

  expect(posts).toHaveLength(2);
});

it("saves", async () => {
  const user = await User.create({
    name: "John Doe",
  });
  const posts = await user.$posts().save([
    new Post({
      text: "Hello World",
    }),
  ]);

  expect(posts[0].userId).toBe(user.id);
});

it("creates", async () => {
  const user = await User.create({
    name: "John Doe",
  });
  const posts = await user.$posts().create([
    {
      text: "Hello World",
    },
  ]);

  expect(posts[0].userId).toBe(user.id);
});

it("supports chaining queries", async () => {
  const user = await User.create({
    name: "John Doe",
  });
  const otherUser = await User.create({
    name: "Jane Doe",
  });
  await Post.create({
    text: "Hello World",
    userId: user.id,
  });
  await Post.create({
    text: "Hello again",
    userId: user.id,
  });
  await Post.create({
    text: "Hello again",
    userId: otherUser.id,
  });

  const posts = await user.$posts().where("text", "Hello again");

  expect(posts).toHaveLength(1);
});
