import type { Collection } from 'collect.js';
import collect from 'collect.js';

import type { ResponseMeta } from '../responses/response.type';

export class ModelCollection<T> {
  protected _items: Collection<T>;

  constructor(
    items: T[],
    protected _meta?: ResponseMeta,
  ) {
    this.setItems(items);
  }

  setItems(items: T[]): this {
    this._items = collect(items);

    return this;
  }

  get items(): Collection<T> {
    return this._items;
  }

  get meta(): ResponseMeta | undefined {
    return this._meta;
  }
}
