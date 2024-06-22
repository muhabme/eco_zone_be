import { plainToClass } from 'class-transformer';
import { Mixin } from 'ts-mixer';

import type { GObj } from '../helpers/object';
import type { BaseResponse } from '../responses/base.response';
import { Encodable } from './encodable';
import { ToObject } from './to-object';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ITransformable {
  // #
}

export class Transformable
  extends Mixin(ToObject, Encodable)
  implements ITransformable
{
  transform<T extends BaseResponse>(
    classResponse: ClassConstructor<BaseResponse>,
  ): T {
    return plainToClass<T, GObj>(
      classResponse as ClassConstructor<T>,
      this as GObj,
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
