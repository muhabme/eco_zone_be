import type { FindOptionsSelect } from 'typeorm';

import type { OptionItem } from '../responses/response.type';

export abstract class ToOptionItem {
  static selectForOptionItem(): FindOptionsSelect<unknown> {
    return {};
  }

  abstract getLabelForOption(): string;

  toOptionItem(keyColumn: string): OptionItem {
    return {
      key: this[keyColumn],
      label: this.getLabelForOption(),
    };
  }
}
