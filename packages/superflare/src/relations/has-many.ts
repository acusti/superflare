import { Model } from "../model";
import { QueryBuilder } from "../query-builder";
import { Relation } from "./relation";

export class HasMany extends Relation {
  constructor(
    public query: QueryBuilder,
    public parent: Model,
    public foreignKey: string,
    public ownerKey: string,
    public relationName: string
  ) {
    super(query);
  }

  save(models: any[]) {
    return Promise.all(
      models.map(async (model) => {
        model[this.foreignKey as keyof Model] =
          this.parent[this.ownerKey as keyof Model];
        await model.save();
        return model;
      })
    );
  }

  create(attributeSets: Record<string, any>[]) {
    return Promise.all(
      attributeSets.map(async (attributes) => {
        const model = new this.query.modelInstance.constructor(attributes);
        model[this.foreignKey as keyof Model] =
          this.parent[this.ownerKey as keyof Model];
        await model.save();
        return model;
      })
    );
  }

  getResults() {
    return (
      this.query
        .where(this.foreignKey, this.parent[this.ownerKey as keyof Model])
        /**
         * Cache the results on the parent model.
         */
        .afterExecute((results) => {
          this.parent[this.relationName as keyof Model] = results;
        })
        .all()
    );
  }
}
