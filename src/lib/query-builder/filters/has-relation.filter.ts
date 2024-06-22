import { type FindOperator, IsNull } from 'typeorm';

import { NonColumnFilter } from './non-column.filter';

export class HasRelationFilter extends NonColumnFilter {
  constructor(
    protected name: string,
    protected column: string,
    alias?: string,
  ) {
    super(alias ?? name);
  }

  build(value: unknown): FindOperator<unknown> {
    if (value === 'null') {
      value = IsNull();
    }

    const path = this.name.split('.');
    const findWhere = {};
    let currentLevel = findWhere;

    for (const [index, segment] of path.entries()) {
      if (index === path.length - 1) {
        currentLevel[segment] = { [this.column]: value };
      } else {
        currentLevel[segment] = {};
        currentLevel = currentLevel[segment];
      }
    }

    return findWhere as unknown as FindOperator<unknown>;
  }
}

export function hasRelationFilter(
  name: string,
  column?: string,
  alias?: string,
) {
  return new HasRelationFilter(name, column ?? 'uuid', alias);
}
