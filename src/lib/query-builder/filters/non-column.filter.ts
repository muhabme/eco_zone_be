import type { FindOptionsWhere } from 'typeorm';

import { QueryBuilderFilter } from './base.filter';

export abstract class NonColumnFilter extends QueryBuilderFilter {
  abstract build(value: unknown): FindOptionsWhere<unknown>;
}
