/**
 * Returns the first element in the array that is not null or undefined.
 * @param arr The array to search for a non-null and non-undefined element.
 * @returns The first non-null and non-undefined element in the array, or undefined if no such element is found.
 */
export const selectAny = <T>(arr: T[]): T | undefined =>
  arr.find((item) => item !== null && item !== undefined);
