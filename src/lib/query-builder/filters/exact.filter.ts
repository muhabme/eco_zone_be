import { startsWith, toString } from 'lodash';
import type { FindOperator, FindOptionsWhere } from 'typeorm';
import { Equal, In, Not } from 'typeorm';

import { stringAfter } from '../../helpers/string';
import { ColumnFilter } from './column.filter';

export class ExactFilter extends ColumnFilter {
  /**
   * Builds the exact match filter based on the input value.
   * It creates an array of EQUAL conditions for each column specified in the constructor.
   *
   * @param {unknown} v - The value to be used in EQUAL conditions.
   * @returns {string | FindOperator<unknown> | FindOptionsWhere<unknown>} An array of exact match conditions for each column.
   */
  build(
    v: unknown,
  ): string | FindOperator<unknown> | FindOptionsWhere<unknown> {
    const value = toString(v);

    if (value.includes(',')) {
      const values = startsWith(value, '!')
        ? stringAfter(value, '!').split(',')
        : value.split(',');

      return stringAfter(value, '!') ? Not(In(values)) : In(values);
    }

    return startsWith(value, '!') ? Not(stringAfter(value, '!')) : Equal(value);
  }
}

/**
 * Factory function to create a new instance of the ExactFilter class.
 * @param {string} column - Columns to be included in the exact match filter.
 * @param {string} [nameOrAlias] - Optional table alias for the columns.
 * @returns {ExactFilter} An instance of ExactFilter.
 * @example // Using the factory function to create an ExactFilter instance
const filter = exactFilter(['name', '!status']);
// filter is now an instance of ExactFilter
 */
export function exactFilter(column: string, nameOrAlias?: string): ExactFilter {
  return new ExactFilter(column, nameOrAlias);
}
