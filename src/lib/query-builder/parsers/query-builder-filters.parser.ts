import { BadRequestException, Injectable } from '@nestjs/common';
import { isEmpty, snakeCase } from 'lodash';
import { type BaseEntity, type FindOptionsWhere } from 'typeorm';

import { toBoolean } from '../../helpers/boolean';
import { toCamelCase } from '../../helpers/string';
import { TypeOrmFindOptionsMerger } from '../../type-orm/helpers/FindOptionsMerger.helper';
import type { QueryBuilderFilter } from '../filters';
import { ColumnFilter, NonColumnFilter } from '../filters';

@Injectable()
export class QueryBuilderFiltersParser<T extends BaseEntity> {
  allowedFilters?: QueryBuilderFilter[];

  requestFilters: Record<string, string> = {};

  setOptions({ allowedFilters }: { allowedFilters?: QueryBuilderFilter[] }) {
    this.allowedFilters = allowedFilters;

    return this;
  }

  parse(
    requestFilters: Record<string, string>,
  ): FindOptionsWhere<T> | undefined {
    if (isEmpty(requestFilters)) {
      return;
    }

    this.requestFilters = requestFilters;

    let where: FindOptionsWhere<T> | undefined;

    const filterDictionary = this.createFilterDictionary();

    for (const filterName of this.extractRequestedFilters()) {
      this.ensureFilterNameIsValid(filterName, filterDictionary);

      const keyword = this.extractFilterKeyword(filterName);

      if (this.isKeywordApplicable(keyword)) {
        where = this.applyFilterToQuery(
          filterDictionary[filterName],
          keyword,
          where,
        );
      }
    }

    return where;
  }

  private createFilterDictionary(): Record<string, QueryBuilderFilter> {
    return (
      this.allowedFilters?.reduce(
        (acc, filter) => ({
          ...acc,
          [filter.alias]: filter,
        }),
        {},
      ) || {}
    );
  }

  private extractRequestedFilters(): string[] {
    return Object.keys(this.requestFilters).map((f) => snakeCase(f));
  }

  private ensureFilterNameIsValid(
    filterName: string,
    filterDictionary: Record<string, QueryBuilderFilter>,
  ): void {
    const isFilterNameValid = filterName in filterDictionary;

    if (!isFilterNameValid)
      throw new BadRequestException('InvalidIncludeQueryException');
  }

  private extractFilterKeyword(filterName: string): string {
    if (this.requestFilters[filterName]) {
      return this.requestFilters[filterName];
    }

    return this.requestFilters[toCamelCase(filterName)];
  }

  private isKeywordApplicable(keyword: string): boolean {
    return toBoolean(keyword) || keyword === 'null';
  }

  private applyFilterToQuery(
    filter: QueryBuilderFilter,
    keyword: string,
    where: FindOptionsWhere<T> | undefined,
  ): FindOptionsWhere<T> | undefined {
    const condition = filter.build(keyword);

    if (filter instanceof ColumnFilter) {
      return TypeOrmFindOptionsMerger.mergeWhere(where, {
        [filter.nameOrAlias]: condition,
      }) as FindOptionsWhere<T>;
    }

    if (filter instanceof NonColumnFilter) {
      return TypeOrmFindOptionsMerger.mergeWhere(
        where,
        condition,
      ) as FindOptionsWhere<T>;
    }

    return where;
  }
}
