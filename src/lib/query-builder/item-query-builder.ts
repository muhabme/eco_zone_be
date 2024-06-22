import { Injectable } from '@nestjs/common';
import type { BaseEntity } from 'typeorm';

import type { FindManyOptions } from '../type-orm/contracts/find-many-options';
import { QueryBuilder } from './query-builder';
import type { ItemQueryParams } from './requests/item-query.params';

@Injectable()
export class ItemQueryBuilder<T extends BaseEntity> extends QueryBuilder<T> {
  protected declare params?: ItemQueryParams;

  parseParams(params?: ItemQueryParams): FindManyOptions<T> {
    this.params = params;

    if (params === undefined) {
      return {};
    }

    return {
      relations: this.parseRelations(),
      countRelations: this.parseCounts(),
    };
  }
}
