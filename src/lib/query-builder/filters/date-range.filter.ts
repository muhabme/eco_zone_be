import type { FindOperator } from 'typeorm';
import { Between } from 'typeorm';

import { BadRequestException } from '@nestjs/common';
import date from '../../helpers/date';
import { ColumnFilter } from './column.filter';

export class DateRangeFilter extends ColumnFilter {
  /**
   * Builds the date range filter based on the input value.
   * It creates an array of BETWEEN conditions for each column specified in the constructor.
   *
   * @param {string} value - The value representing the date range in the format YYYY-MM-DD:YYYY-MM-DD.
   * @returns {FindOperator<Date>} An array of date range conditions for each column.
   */
  build(value: string): FindOperator<Date> {
    if (!/^\d{4}-\d{2}-\d{2}:\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new BadRequestException('InvalidIncludeQueryException');
    }

    const [start, end] = value.split(':');
    const startDate = date(start).toDate();
    const endDate = date(end).toDate();

    endDate.setHours(23, 59, 59, 0);

    return Between<Date>(startDate, endDate);
  }
}

/**
 * Factory function to create a new instance of the DateRangeFilter class.
 *
 * @param {string|string[]} columns - Columns to be included in the date range filter.
 * @param {string} [alias] - Optional table alias for the columns.
 * @returns {DateRangeFilter} An instance of DateRangeFilter.
 */
export function dateRangeFilter(
  column: string,
  alias?: string,
): DateRangeFilter {
  return new DateRangeFilter(column, alias);
}
