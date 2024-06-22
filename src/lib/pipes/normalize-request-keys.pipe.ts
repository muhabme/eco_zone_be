import type { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import { type GObj, Obj } from '../helpers/object';

interface IRequestKeysPipeOptions {
  body: boolean;
}

@Injectable()
export class RequestKeysPipe implements PipeTransform<GObj> {
  constructor(protected _options: Partial<IRequestKeysPipeOptions>) {}

  /**
   * Method that accesses and performs optional transformation on argument for
   * in-flight requests.
   *
   * @param value currently processed route argument
   * @param metadata contains metadata about the currently processed route argument
   */
  transform(value: GObj, _metadata: ArgumentMetadata) {
    if (_metadata.type === 'body') {
      value = this.transformBodyKeys(value, _metadata);
    }

    return value;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transformBodyKeys(value: GObj, _metadata: ArgumentMetadata) {
    return Obj.of(value).keysToSnakeCase();
  }
}
