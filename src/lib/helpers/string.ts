import {
  isString as _isString,
  toString as _toString,
  camelCase,
  capitalize,
  kebabCase,
  lowerCase,
  snakeCase,
  startCase,
  upperCase,
} from 'lodash';
import slugify from 'slugify';

export const isString = (string: unknown) => _isString(string);
export const toString = (string: unknown) => _toString(string);
export const trim = (string: string) => string.replaceAll(/\s+/g, ' ').trim();

export const stringAfter = (string: string, search: string) => {
  const index = string.indexOf(search);

  if (index === -1) {
    return '';
  }

  return string.slice(index + search.length);
};

export const stringBefore = (string: string, search: string) =>
  string.split(search)[0];

export const toKebabCase = (string: string): string => kebabCase(string);
export const toCamelCase = (string: string): string => camelCase(string);
export const toSnakeCase = (string: string): string => snakeCase(string);
export const toUpperCase = (string: string): string => upperCase(string);
export const toLowerCase = (string: string): string => lowerCase(string);
export const toPascalCase = (string: string): string => capitalize(string);
export const toTitleCase = (string: string): string => startCase(string);
export const toConstantCase = (string: string): string =>
  toUpperCase(toCamelCase(string)).replaceAll(' ', '_');
export const toSlug = (string: string): string =>
  slugify(string, { lower: true, trim: true, locale: 'en' });

export const isEmail = (string: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(string);
};

export const isMobile = (string: string): boolean => {
  const mobileRegex = /^(009665|9665|\+9665|05|5)([013-9])(\d{7})$/;

  return mobileRegex.test(string);
};

export const endsWith = (
  string: string,
  searchValue: string | string[],
  endPosition?: number,
): boolean => {
  if (Array.isArray(searchValue)) {
    for (const s of searchValue) {
      if (
        endsWith(string, toSnakeCase(s), endPosition) ||
        endsWith(string, toPascalCase(s), endPosition)
      ) {
        return true;
      }
    }

    return false;
  }

  return (
    string.endsWith(toSnakeCase(searchValue), endPosition) ||
    string.endsWith(toPascalCase(searchValue), endPosition)
  );
};

export const isEmptyString = (str: string) => trim(str) === '';

export const isLowercase = (str: string) => str === toLowerCase(str);
