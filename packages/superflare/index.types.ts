/**
 * Export everything from `index.ts` *except* Model, because we have to manually
 * compose and export types for Model/QueryBuilder.
 **/

export {
  setConfig,
  defineConfig,
  type SuperflareUserConfig,
  type DefineConfigReturn,
} from "./src/config";
export { DatabaseException } from "./src/query-builder";
export { seed } from "./src/seeder";
export {
  storage,
  servePublicPathFromStorage,
  type R2Input,
} from "./src/storage";
export { Factory } from "./src/factory";
export { handleFetch } from "./src/fetch";
export { handleQueue } from "./src/queue";
export { SuperflareSession, type Session } from "./src/session";
export { Job } from "./src/job";
export { SuperflareAuth } from "./src/auth";
export { hash } from "./src/hash";
export { Event } from "./src/event";
export { Listener } from "./src/listener";
export { handleWebSockets } from "./src/websockets";
export { Channel } from "./src/durable-objects/Channel";
export { Schema } from "./src/schema";
export { parseMultipartFormData } from "./src/form-data";
export { handleScheduled } from "./src/scheduled";

/**
 * Shape of the model instance.
 */
export interface ModelInstance<M> {
  id: number;
  hidden: string[];
  save(): Promise<boolean>;
  delete(): Promise<boolean>;
  update(attributes: any): Promise<boolean>;
  toJSON(): any;

  belongsTo<M extends BaseModel>(model: M): BelongsTo<M>;
  hasOne<M extends BaseModel>(model: M): HasOne<M>;
  hasMany<M extends BaseModel>(model: M): HasMany<M>;
}

export interface BelongsTo<M extends BaseModel, R = InstanceType<M>>
  extends QueryBuilder<M, R> {
  associate(model: any): R;
  dissociate(): R;
}

export interface HasOne<M extends BaseModel, R = InstanceType<M>>
  extends QueryBuilder<M, R> {
  save(model: any): Promise<R>;
  create(attributes: any): Promise<R>;
}

export interface HasMany<M extends BaseModel, R = InstanceType<M>[]>
  extends QueryBuilder<M, R> {
  save(model: any): Promise<R>;
  create(attributes: any): Promise<R>;
}

/**
 * Shape of the model constructor (static properties).
 */
export interface BaseModel<M = any> {
  find<T extends BaseModel>(this: T, ids: number[]): QueryBuilder<T>;
  find<T extends BaseModel>(
    this: T,
    id: number
  ): QueryBuilder<T, InstanceType<T>, true>;
  all<T extends BaseModel>(this: T): QueryBuilder<T>;
  where<T extends BaseModel>(
    this: T,
    field: string,
    value: string | number
  ): QueryBuilder<T>;
  where<T extends BaseModel>(
    this: T,
    field: string,
    operator: string,
    value?: string | number
  ): QueryBuilder<T>;
  whereIn<T extends BaseModel>(
    this: T,
    field: string,
    values: (string | number)[]
  ): QueryBuilder<T>;
  with<T extends BaseModel>(
    this: T,
    relationName: string | string[]
  ): QueryBuilder<T>;
  orderBy<T extends BaseModel>(
    this: T,
    field: string,
    direction?: "asc" | "desc"
  ): QueryBuilder<T>;
  query<T extends BaseModel>(this: T): QueryBuilder<T>;
  // Changes return type to single instance:
  first<T extends BaseModel>(this: T): QueryBuilder<T, InstanceType<T>, true>;
  count<T extends BaseModel>(this: T): Promise<number>;

  create<T extends BaseModel>(
    this: T,
    attributes: any
  ): Promise<InstanceType<T>>;

  register(model: any): void;

  tableName: string;
  connection: string;

  new (attributes?: any): ModelInstance<M>;
}

// Helper type to extract the JSON return type from a model instance
type JSONReturnType<I> = I extends ModelInstance<any>
  ? ReturnType<I["toJSON"]>
  : never;

// Helper type to determine if the query will return a single item or array
type QueryResult<I, IsSingle extends boolean> = IsSingle extends true ? I : I[];

interface QueryBuilder<
  M extends BaseModel,
  I = InstanceType<M>,
  IsSingle extends boolean = false
> {
  find<T>(this: T, id: number): QueryBuilder<M, I, true>;
  find<T>(this: T, ids: number[]): this;
  where<T>(this: T, field: string, value: any): this;
  where<T>(this: T, field: string, operator: string, value?: any): this;
  whereIn<T>(this: T, field: string, values: (string | number)[]): this;
  with<T>(this: T, relationName: string | string[]): this;
  limit<T>(this: T, limit: number): this;
  orderBy<T>(this: T, field: string, direction?: "asc" | "desc"): this;
  // Changes return type to single instance:
  first(): QueryBuilder<M, I, true>;

  // Promise-returning methods with specific return types
  count<T>(this: T): Promise<number>;
  get(): Promise<QueryResult<I, IsSingle>>;
  toJSON(): Promise<
    IsSingle extends true ? JSONReturnType<I> : JSONReturnType<I>[]
  >;

  // Promise compatibility
  then<Result = QueryResult<I, IsSingle>>(
    onfulfilled?: (
      value: QueryResult<I, IsSingle>
    ) => Result | PromiseLike<Result>
  ): Promise<Result>;
  catch<Result = QueryResult<I, IsSingle>>(
    onrejected?: ((reason: any) => Result | PromiseLike<Result>) | null
  ): Promise<Result>;
}

declare const Model: BaseModel;

export { Model };
