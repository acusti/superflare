import { Model } from "superflare";
import { User } from "./User";

export class Article extends Model {
  user!: User;
  $user() {
    return this.belongsTo(User);
  }

  toJSON(): ArticleRow {
    return super.toJSON();
  }
}

Model.register(Article);

export interface Article extends ArticleRow {}
