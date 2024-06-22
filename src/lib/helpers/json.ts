import type { GObj } from './object';

export function stringify(obj: unknown): string {
  const cache: GObj[] = [];

  return JSON.stringify(obj, function (key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.includes(value as GObj)) {
        // Circular reference found, discard key
        return;
      }

      // Store value in our collection
      cache.push(value as GObj);
    }

    return value;
  });
}
