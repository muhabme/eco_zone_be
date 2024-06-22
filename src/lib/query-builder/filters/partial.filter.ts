import type { FindOperator, FindOptionsWhere } from 'typeorm';
import { Like } from 'typeorm';

import { ColumnFilter } from './column.filter';

export class PartialFilter extends ColumnFilter {
  /**
   * Builds the partial match filter based on the input value.
   * It creates an array of LIKE conditions for each column specified in the constructor.
   *
   * @param {unknown} value - The value to be used in LIKE conditions.
   * @returns {string | FindOperator<unknown> | FindOptionsWhere<unknown>} An array of partial match conditions for each column.
   */
  build(
    value: unknown,
  ): string | FindOperator<unknown> | FindOptionsWhere<unknown> {
    return Like(`%${value}%`);
  }
}

/**
 * Factory function to create a new instance of the PartialFilter class.
 *
 * @param {string|string[]} columns - Columns to be included in the partial match filter.
 * @param {string} [alias] - Optional table alias for the columns.
 * @returns {PartialFilter} An instance of PartialFilter.
 */
export function partialFilter(
  columns: string | string[],
  alias?: string,
): PartialFilter {
  columns = Array.isArray(columns) ? columns : [columns];

  return new PartialFilter(columns, alias);
}
