import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

import type { QueryBuilderFilter } from '../filters/base.filter';

export class QueryBuilderOptions<T> {
  @IsOptional()
  @Type(() => Array<keyof T>)
  allowedSorts?: string[];

  @IsOptional()
  @Type(() => Array<QueryBuilderFilter>)
  allowedFilters?: QueryBuilderFilter[];

  @IsOptional()
  @Type(() => Array<keyof T>)
  allowedIncludes?: string[];

  @IsOptional()
  @Type(() => Array<keyof T>)
  allowedIncludeCounts?: Array<keyof T>;
}
