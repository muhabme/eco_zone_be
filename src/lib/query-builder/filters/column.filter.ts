import type { FindOperator, FindOptionsWhere } from 'typeorm';

import { QueryBuilderFilter } from './base.filter';

export abstract class ColumnFilter extends QueryBuilderFilter {
  /**
   * Creates an instance of ColumnFilter.
   * @param {string|string[]} columns - Columns to be included in the filter.
   * @param {string} [nameOrAlias] - Optional table alias for the columns.
   */
  constructor(
    protected columns: string | string[],
    nameOrAlias?: string,
  ) {
    const alias =
      nameOrAlias ?? (Array.isArray(columns) ? columns.join('_') : columns);

    super(alias);
    this.columns = columns;
  }

  /**
   * Abstract build method to be implemented by derived classes.
   *
   * @param {unknown} value - The value to be used in the filter conditions.
   * @returns {string | FindOperator<unknown> | FindOptionsWhere<unknown> |} An array of filter conditions for each column.
   */
  abstract build(
    value: unknown,
  ):
    | string
    | FindOperator<unknown>
    | FindOptionsWhere<unknown>
    | Array<Record<string, FindOperator<string>>>;
}
