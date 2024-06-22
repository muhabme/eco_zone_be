import { BadRequestException, Injectable } from '@nestjs/common';
import { isEmpty, toNumber } from 'lodash';
import type {
  BaseEntity,
  FindOptionsOrder,
  FindOptionsOrderValue,
  FindOptionsWhere,
} from 'typeorm';

import { stringAfter, toSnakeCase } from '../helpers/string';
import type { FindManyOptions } from '../type-orm/contracts/find-many-options';
// import { InvalidSortQueryException } from './exceptions/invalid-sort-query.exception';
import { QueryBuilderFiltersParser } from './parsers/query-builder-filters.parser';
import { QueryBuilder } from './query-builder';
import type { ListQueryParams } from './requests/list-query.params';

@Injectable()
export class ListQueryBuilder<T extends BaseEntity> extends QueryBuilder<T> {
  protected declare params?: ListQueryParams;

  private filterParser: QueryBuilderFiltersParser<T>;

  constructor() {
    super();
    this.filterParser = new QueryBuilderFiltersParser();
  }

  parseParams(params?: ListQueryParams): FindManyOptions<T> {
    this.params = params;

    if (params === undefined) {
      return {};
    }

    return {
      where: this.parseFilters(),
      order: this.parseSorting(),
      relations: this.parseRelations(),
      countRelations: this.parseCounts(),
      ...this.parsePagination(),
    };
  }

  protected parsePagination():
    | { take: number | undefined; skip: number | undefined }
    | undefined {
    if (this.params?.paginate === undefined) {
      return;
    }

    const skip = toNumber(
      toNumber(this.params.paginate) * (toNumber(this.params.page ?? 1) - 1),
    );

    return { take: this.params.paginate, skip };
  }

  protected parseFilters(): FindOptionsWhere<T> | undefined {
    if (isEmpty(this.options?.allowedFilters) || isEmpty(this.params?.filter)) {
      return;
    }

    this.filterParser.setOptions({
      allowedFilters: this.options!.allowedFilters,
    });

    return this.filterParser.parse(this.params.filter);
  }

  protected parseSorting(): FindOptionsOrder<T> | undefined {
    if (this.params?.sort === undefined) {
      return { updated_at: 'DESC' } as unknown as FindOptionsOrder<T>;
    }

    const column = toSnakeCase(
      this.params.sort.startsWith('-')
        ? stringAfter(this.params.sort, '-')
        : this.params.sort,
    );
    const direction: FindOptionsOrderValue = this.params.sort.startsWith('-')
      ? 'DESC'
      : 'ASC';

    if (!this.options?.allowedSorts?.includes(column)) {
      throw new BadRequestException('InvalidIncludeQueryException');
    }

    return {
      [column]: direction,
    } as FindOptionsOrder<T>;
  }
}
