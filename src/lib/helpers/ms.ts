import type { StringValue } from 'ms';
import * as ms from 'ms';

export function toMilliseconds(value: StringValue) {
  return ms(value);
}
