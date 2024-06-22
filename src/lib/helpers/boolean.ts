import { Collection } from 'collect.js';

/**
 * Converts a value to a boolean.
 * @param value - The value to convert.
 * @returns The boolean representation of the value.
 * @example
 * toBoolean('true'); // true
 * toBoolean('false'); // false
 * toBoolean(''); // false
 * toBoolean('0'); // false
 * toBoolean('1'); // true
 * toBoolean([]); // false
 * toBoolean({}); // false
 * toBoolean(['foo']); // true
 * toBoolean({foo: 'bar'}); // true
 */
export const toBoolean = (value: unknown): boolean => {
  // function or class
  if (typeof value === 'function') {
    return true;
  }

  // string
  if (typeof value === 'string') {
    const falsyValues = ['false', '0', 'null', 'undefined', 'nan', ''];
    const lowerCaseValue = value.toLowerCase().trim();

    return !falsyValues.includes(lowerCaseValue);
  }

  // array
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  // date
  if (value instanceof Date) {
    return true;
  }

  // collection
  if (value instanceof Collection) {
    return value.isNotEmpty();
  }

  // object
  if (value instanceof Object) {
    return Object.keys(value).length > 0;
  }

  // else
  return Boolean(value);
};

export const blank = (value: unknown): boolean => !toBoolean(value);
export const empty = (value: unknown): boolean => !toBoolean(value);
export const notEmpty = (value: unknown): boolean => toBoolean(value);
