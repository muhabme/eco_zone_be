import { merge } from 'lodash';
import type { FindOneOptions, FindOptionsWhere } from 'typeorm';

import type { FindManyOptions } from '../contracts/find-many-options';

/**
 * Utility class for merging TypeORM Find Options using Lodash.
 * Provides a method to merge two sets of find options, handling deep merging of objects,
 * which is beneficial for properties like where conditions and relations.
 */
export class TypeOrmFindOptionsMerger {
  /**
   * Merges two sets of find options.
   * @param defaultOptions - The default set of find options.
   * @param givenOptions - The given set of find options to be merged with the default.
   * @returns The merged find options.
   */
  static merge<T>(
    defaultOptions?: FindOneOptions<T> | FindManyOptions<T>,
    givenOptions?: FindOneOptions<T> | FindManyOptions<T>,
  ): FindOneOptions<T> | FindManyOptions<T> | undefined {
    // First, clone the defaultOptions and givenOptions to avoid mutating the original objects
    const clonedDefaultOptions: FindOneOptions<T> | FindManyOptions<T> = {
      ...defaultOptions,
    };
    const clonedGivenOptions: FindOneOptions<T> | FindManyOptions<T> = {
      ...givenOptions,
    };

    // Handle special merging for 'where' conditions
    if (clonedDefaultOptions.where || clonedGivenOptions.where) {
      const mergedWhere = TypeOrmFindOptionsMerger.mergeWhere(
        clonedDefaultOptions.where,
        clonedGivenOptions.where,
      );
      clonedDefaultOptions.where = mergedWhere;
      // Remove 'where' from givenOptions to avoid duplicating the merge
      delete clonedGivenOptions.where;
    }

    // Use lodash's merge function for other properties
    return merge({}, clonedDefaultOptions, clonedGivenOptions);
  }

  /**
   * Merges 'where' conditions from defaultOptions and givenOptions.
   * @param defaultWhere - The 'where' condition from the default options.
   * @param givenWhere - The 'where' condition from the given options.
   * @returns The merged 'where' condition.
   */
  static mergeWhere<T>(
    defaultWhere?: FindOptionsWhere<T> | Array<FindOptionsWhere<T>>,
    givenWhere?: FindOptionsWhere<T> | Array<FindOptionsWhere<T>>,
  ): Array<FindOptionsWhere<T>> | FindOptionsWhere<T> | undefined {
    // Check if either is undefined
    if (!defaultWhere) {
      return givenWhere;
    }

    if (!givenWhere) {
      return defaultWhere;
    }

    // Handle cases where both are arrays
    if (Array.isArray(defaultWhere) && Array.isArray(givenWhere)) {
      return [...defaultWhere, ...givenWhere];
    }

    // Handle the case where one is an array and the other is an object
    if (Array.isArray(defaultWhere) && !Array.isArray(givenWhere)) {
      return defaultWhere.map((item) => merge({}, item, givenWhere));
    } else if (!Array.isArray(defaultWhere) && Array.isArray(givenWhere)) {
      return givenWhere.map((item) => merge({}, defaultWhere, item));
    }

    // If both are objects, just merge them
    return merge({}, defaultWhere, givenWhere);
  }
}
