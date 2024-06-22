import { Module } from '@nestjs/common';

import { ItemQueryBuilder } from './item-query-builder';
import { ListQueryBuilder } from './list-query-builder';
import { QueryBuilderFiltersParser } from './parsers/query-builder-filters.parser';

@Module({
  imports: [],
  providers: [QueryBuilderFiltersParser, ListQueryBuilder, ItemQueryBuilder],
  exports: [ListQueryBuilder, ItemQueryBuilder],
})
export class QueryBuilderModule {}
