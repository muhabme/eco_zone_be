import { HttpStatus } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { hasMixin } from 'ts-mixer';
import type { BaseEntity } from 'typeorm';

import { Transformable } from '../concerns/transformable';
import { BaseModel } from '../entities/base.entity';
import { ModelCollection } from '../entities/collection.entity';
import type { GObj } from '../helpers/object';
import { toCamelCase } from '../helpers/string';
import { CamelToSnakeCaseProps } from '../types/camelcase-to-snakecase';
import type { BaseResponse } from './base.response';
import {
  ItemResponse,
  ListResponse,
  OptionsResponse,
  ResponseSchema,
} from './response.type';

export class JsonResponse<T extends BaseResponse> {
  responseMessage(): string {
    const translationKey = toCamelCase(this.constructor.name);
    const fullTranslationKey = `responses.${translationKey}`;

    return fullTranslationKey;
  }

  json(response?: ResponseSchema | BaseModel): ResponseSchema;

  json(
    response?: ModelCollection<BaseEntity> | ListResponse<T>,
  ): ListResponse<T>;

  json(response?: ItemResponse<T>): ItemResponse<T>;

  json(
    response?:
      | ResponseSchema
      | BaseModel
      | ModelCollection<BaseEntity>
      | ItemResponse<T>
      | ListResponse<T>,
  ): ResponseSchema | ItemResponse<T> | ListResponse<T> {
    const res: ResponseSchema = {
      status: HttpStatus.OK,
      ...response,
    };

    // get class of the current instance
    const responseClass: ClassConstructor<BaseResponse> =
      Object.getPrototypeOf(this).constructor;

    if (res instanceof ModelCollection) {
      return {
        message: this.responseMessage(),
        status: HttpStatus.OK,
        data: res.items.map((_i: GObj) => {
          try {
            return (_i as BaseEntity & Transformable).transform(responseClass);
          } catch {
            return _i;
          }
        }),
        meta: res.meta,
      };
    }

    if (res instanceof BaseModel || hasMixin(res, BaseModel)) {
      return {
        message: this.responseMessage(),
        status: HttpStatus.OK,
        data: res.transform(responseClass),
      };
    }

    res.data = res.data || {};
    res.message = res.message || this.responseMessage();

    return res;
  }

  parseObject(response?: CamelToSnakeCaseProps<Partial<this>>) {
    // get class of the current instance
    const responseClass: ClassConstructor<BaseResponse> =
      Object.getPrototypeOf(this).constructor;

    return plainToClass(responseClass, response, {
      excludeExtraneousValues: true,
    });
  }

  options(response?: OptionsResponse): OptionsResponse {
    const res = (response ?? { status: HttpStatus.OK }) as OptionsResponse;

    res.message = res.message || this.responseMessage();

    return res;
  }
}
