import type { BaseEntity, FindOneOptions, FindOptionsRelations } from 'typeorm';

import { BadRequestException } from '@nestjs/common';
import { toBoolean } from '../helpers/boolean';
import type { QueryBuilderOptions } from './contracts/query-builder-options.contract';
import type { ItemQueryParams } from './requests/item-query.params';
import type { ListQueryParams } from './requests/list-query.params';

export abstract class QueryBuilder<T extends BaseEntity> {
  protected params?: ItemQueryParams | ListQueryParams;

  options?: QueryBuilderOptions<T>;

  abstract parseParams(
    params?: ItemQueryParams | ListQueryParams,
  ): FindOneOptions<T>;

  setOptions(options?: QueryBuilderOptions<T>) {
    this.options = options;

    return this;
  }

  protected parseRelations(): FindOptionsRelations<T> | undefined {
    const allowedIncludes = this.options?.allowedIncludes;
    const includes = this.params?.include;

    if (includes === undefined || allowedIncludes === undefined) {
      return;
    }

    const relations = Array.isArray(includes) ? includes : includes.split(',');

    if (
      !toBoolean(
        relations.every((value: string) => allowedIncludes.includes(value)),
      )
    ) {
      throw new BadRequestException('InvalidIncludeQueryException');
    }

    return relations as FindOptionsRelations<T>;
  }

  protected parseCounts(): FindOptionsRelations<T> | undefined {
    const allowedCounts = this.options?.allowedIncludeCounts;
    const includesCounts = this.params?.includeCount;

    if (includesCounts === undefined || allowedCounts === undefined) {
      return;
    }

    const counts = Array.isArray(includesCounts)
      ? includesCounts
      : includesCounts.split(',');

    if (
      !toBoolean(
        counts.every((value) => allowedCounts.includes(value as keyof T)),
      )
    ) {
      throw new BadRequestException('InvalidIncludeCountsQueryException');
    }

    const countRelation: FindOptionsRelations<T> = {};

    for (const c of counts) {
      countRelation[c] = true;
    }

    return countRelation;
  }
}
