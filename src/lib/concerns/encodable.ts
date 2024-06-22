import { deserialize, instanceToPlain } from 'class-transformer';

import type { GObj } from '../helpers/object';

export abstract class Encodable {
  encode(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  static decode<T extends GObj & Encodable>(
    this: typeof Encodable & (new () => T),
    encoded: string,
  ): T {
    // return instanceToClass(this, JSON.parse(encoded))
    return deserialize(this, encoded);
  }
}
