import { set } from 'lodash';
import type { FindOptionsWhere } from 'typeorm';
import { Like } from 'typeorm';

import { NonColumnFilter } from './non-column.filter';

/**
 * @class SearchFilter
 * @extends NonColumnFilter
 *
 * This class is used to create a search filter for database queries using TypeORM.
 * It extends `NonColumnFilter`, inheriting its basic filtering capabilities.
 *
 * The primary purpose of `SearchFilter` is to generate search conditions for a list of columns.
 * It is specifically designed to work with SQL LIKE queries for partial matching.
 *
 * @example
 * // Creating an instance of SearchFilter for specific columns
 * const searchFilter = new SearchFilter(['full_name', 'email', 'roles.slug']);
 *
 * // Building a search filter for a given value
 * const filters = searchFilter.build('John');
 * // filters will contain SQL LIKE conditions for 'full_name' 'email' and 'roles.slug' with '%John%'
 *
 * @param {string[]} columns - An array of strings representing the database columns to be included in the search.
 */
export class SearchFilter extends NonColumnFilter {
  /**
   * Creates an instance of SearchFilter.
   *
   * @param {string[]} columns - Columns to be included in the search filter.
   */
  constructor(
    private columns: string[],
    private code: string,
  ) {
    super('search');
    this.columns = columns;
    this.code = code;
  }

  getColumns(): string[] {
    return this.columns;
  }

  /**
   * Builds the search filter based on the input value.
   * It creates an array of LIKE conditions for each column specified in the constructor.
   *
   * @param {string} value - The search value to be used in LIKE conditions.
   * @returns {Object[]} An array of search conditions for each column.
   */
  build(value: string): FindOptionsWhere<unknown> {
    if (value.startsWith(this.code) && /\d/.test(value)) {
      const matches = value.match(/0*([1-9]\d*)$/);
      value = Number.parseInt(matches![1], 10).toString();
    }

    return this.columns.map((column) => {
      if (column.includes('.')) {
        return set({}, column, Like(`%${value}%`));
      }

      return { [column]: Like(`%${value}%`) };
    });
  }
}

/**
 * Factory function to create a new instance of the SearchFilter class.
 *
 * @param {string[]} columns - Columns to be included in the search filter.
 * @returns {SearchFilter} An instance of SearchFilter.
 *
 * @example
 * // Using the factory function to create a SearchFilter instance
 * const filter = searchFilter(['full_name', 'email', 'roles.slug']);
 * // filter is now an instance of SearchFilter
 */
export function searchFilter(
  columns: string[],
  code?: string | undefined,
): SearchFilter {
  return new SearchFilter(columns, code!);
}
