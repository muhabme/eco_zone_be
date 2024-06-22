import { decorate } from 'ts-mixer';
import type {
  BaseEntity,
  EntityMetadata,
  FindOptionsRelations,
  SelectQueryBuilder,
} from 'typeorm';
import { AfterLoad } from 'typeorm';

import type { FindManyOptions } from '../contracts/find-many-options';

export class FindOptions {
  static buildQuery<T extends BaseEntity>(
    this: typeof BaseEntity,
    findOptions?: FindManyOptions<T>,
  ): SelectQueryBuilder<T> {
    const queryBuilder: SelectQueryBuilder<T> =
      this.createQueryBuilder() as unknown as SelectQueryBuilder<T>;

    if (findOptions) {
      queryBuilder.setFindOptions(findOptions);

      if (findOptions.countRelations) {
        FindOptions.loadRelationCounts(
          findOptions.countRelations,
          queryBuilder,
          this.getRepository().metadata,
        );
      }
    }

    return queryBuilder;
  }

  private static loadRelationCounts<T extends BaseEntity>(
    countOptions: FindOptionsRelations<T>,
    queryBuilder: SelectQueryBuilder<T>,
    entityMetadata: EntityMetadata,
  ) {
    for (const [relationKey, shouldCount] of Object.entries(countOptions)) {
      if (!shouldCount) {
        continue;
      }

      // Retrieve the metadata for the relation
      const relation = entityMetadata.findRelationWithPropertyPath(relationKey);

      if (!relation) {
        throw new Error(
          `Relation "${relationKey}" is not defined on the entity.`,
        );
      }

      const relationAlias = `${queryBuilder.alias}_${relationKey}`;
      const relationTable =
        relation.joinTableName || relation.inverseEntityMetadata.tableName;
      const propertyName =
        relation.inverseRelation?.joinColumns[0]?.propertyName ??
        relation.joinColumns[0]?.propertyName;

      queryBuilder.addSelect(
        (subQuery) =>
          subQuery
            .select(
              `COUNT(DISTINCT ${relationAlias}.id)`,
              `${queryBuilder.alias}_${relationKey}Count`,
            )
            .from(relationTable, relationAlias)
            .where(
              `${queryBuilder.alias}.id = ${relationAlias}.${propertyName}`,
            ),
        `${queryBuilder.alias}_${relationKey}Count`,
      );
    }

    return queryBuilder;
  }

  @decorate(AfterLoad())
  mapCounts() {
    for (const attribute of Object.keys(this)) {
      if (!attribute.endsWith('Count')) {
        continue;
      }

      if (this[attribute] === undefined) {
        continue;
      }

      this[attribute] = Number(this[attribute]);
    }
  }
}
