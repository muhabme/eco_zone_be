import { classToPlain } from 'class-transformer';
import { isArray, isObject } from 'lodash';

import { empty, toBoolean } from './boolean';
import { isString, toCamelCase, toSnakeCase } from './string';

export type GKey = string | number | symbol;
export type GObj = Record<GKey, any>;

/**
@module helpers
@typedef {string} GKey - Represents a key that can be a string, number, or symbol.
@typedef {Object} GObj - Represents a generic object of type Record<GKey, unknown>. */

export class Obj<T extends GObj> {
  /**
   * Creates a new Obj instance from the given object
   * @param obj - The object to wrap
   * @returns A new Obj instance
   */
  static of(obj: GObj): Obj<GObj> {
    return new Obj(obj);
  }

  /**
   * Maps over the keys and values of the given object
   * @param obj - The object to map over
   * @param callback - The callback function for each key-value pair
   * @returns The mapped results
   */
  static mapTo(
    obj: GObj,
    callback: (key: GKey, value: unknown) => unknown,
  ): unknown[] {
    const keys = Object.keys(obj);

    return keys.map((key: GKey) => callback(key, obj[key]));
  }

  /**
   * Checks if the given object matches the given type
   * @param type - The type to check against
   * @param obj - The object to check
   * @returns True if the object matches the type
   */
  static isTypeOf(type: string, obj: unknown): boolean {
    return toBoolean(
      Obj.isValid(obj) && (obj as GObj).constructor.name === type,
    );
  }

  /**
   * Checks if the given value is a valid object
   * @param obj - The value to check
   * @returns True if the value is an object
   */
  static isValid(obj: unknown): boolean {
    return typeof obj === 'object';
  }

  private data: Partial<T> = {};

  /**
   * Constructs a new Obj instance
   * @param obj - The initial object value
   */
  constructor(private obj: T) {}

  /**
   * Gets all data from the wrapped object
   * @returns All data from the wrapped object
   */
  getAll(): Partial<T> {
    return this.obj;
  }

  /**
   * Gets the stored data
   * @returns The stored data
   */
  get(): Partial<T> {
    if (this.isEmpty(this.data)) {
      this.data = this.obj;
    }

    return this.data;
  }

  /**
   * Filters the data to only include the given keys
   * @param keys - The keys to filter by
   * @returns This instance for chaining
   */
  filter(keys: GKey | GKey[] | undefined): this {
    const k = this.parseKeys(keys);

    const filtered = Object.keys(this.obj).filter((key: GKey) =>
      k.includes(key),
    );

    this.data = {};

    for (const key of filtered) {
      this.data[key as keyof T] = this.obj[key] as T[keyof T] | undefined;
    }

    return this;
  }

  /**
   * Filters the data to only include objects matching the given values
   * @param values - The values to filter by
   * @returns This instance for chaining
   */
  parse(values: unknown): this {
    const v = this.parseValues(values);

    const filtered = Object.keys(this.obj).filter((key: GKey) =>
      v.includes(this.obj[key]),
    );

    this.data = {};

    for (const key of filtered) {
      this.data[key as keyof T] = this.obj[key] as T[keyof T] | undefined;
    }

    return this;
  }

  /**
   * Gets the values of the filtered data
   * @param keys - Optional keys to filter by first
   * @returns The values
   */
  getValues(keys?: GKey | GKey[]): unknown[] {
    if (!this.isEmpty(keys)) {
      this.filter(keys);
    }

    return Object.values(this.get());
  }

  /**
   * Gets the keys of the filtered data
   * @param keys - Optional keys to filter by first
   * @returns The keys
   */
  getKeys(keys?: GKey | GKey[]): unknown[] {
    if (!this.isEmpty(keys)) {
      this.filter(keys);
    }

    return Object.keys(this.get());
  }

  /**
   * Removes properties prefixed with an underscore from the given object
   * @returns The object without private properties
   */
  removePrivateProperties(): GObj {
    return classToPlain(this.obj, { excludePrefixes: ['_'] }) as GObj;
  }

  keysToCamelCase(): GObj {
    return this.mapWithKeys((key, value) => ({
      key: toCamelCase(key as string),
      value,
    }));
  }

  keysToSnakeCase(): GObj {
    return this.mapWithKeys((key, value) => {
      if (isArray(value)) {
        value = value.map((v: unknown) =>
          isObject(v) ? Obj.of(v).keysToSnakeCase() : v,
        );
      }

      return { key: toSnakeCase(key as string), value };
    });
  }

  mapWithKeys(
    map: (
      key: keyof T,
      value: T[keyof T],
    ) => { key: keyof T; value: T[keyof T] },
  ): GObj {
    const keys = Object.keys(this.obj);

    for (const key of keys) {
      const value = this.obj[key] as T[keyof T];

      const { key: newKey, value: newValue } = map(key, value);

      delete this.obj[key];

      this.obj[newKey] = newValue;
    }

    return this.obj;
  }

  /**
   * Parses the given keys parameter
   * @param keys - The keys parameter
   * @returns The parsed keys array
   */
  private parseKeys(keys?: GKey | GKey[]): GKey[] {
    if (keys === undefined) {
      return [];
    }

    if (isString(keys)) {
      return [keys] as GKey[];
    }

    return keys as GKey[];
  }

  /**
   * Parses the given values parameter
   * @param values - The values parameter
   * @returns The parsed values array
   */
  private parseValues(values?: unknown): unknown[] {
    if (this.isEmpty(values)) {
      return [];
    }

    if (!Array.isArray(values)) {
      return [values] as unknown[];
    }

    return values as unknown[];
  }

  /**
   * Checks if the given parameter is empty
   * @param keys - The parameter to check
   * @returns True if empty
   */
  private isEmpty(keys?: unknown): boolean {
    return empty(keys);
  }
}
