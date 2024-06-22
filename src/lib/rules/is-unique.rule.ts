import type {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';
import { registerDecorator, ValidatorConstraint } from 'class-validator';
import { camelCase, isArray } from 'lodash';
import {
  type BaseEntity,
  type FindOptionsWhere,
  In,
  Not,
  type Repository,
} from 'typeorm';

import { notEmpty } from '../helpers/boolean';
import type { BaseRequest } from '../responses/base.request';

export interface IsUniqueValidationArgs {
  property: string;
  object: BaseRequest;
  value: string | string[];
}

export interface IsUniqueValidationOptions {
  entity: typeof BaseEntity;
  query?: (args: IsUniqueValidationArgs) => Promise<boolean>;
  column?: string;
  load?: boolean;
  except?: { param?: string; column?: string };
  where?: FindOptionsWhere<unknown> | Array<FindOptionsWhere<unknown>>;
}

/**
 * Validates a value is unique
 */
@ValidatorConstraint({ async: true })
export class IsUniqueValidation implements ValidatorConstraintInterface {
  protected options: IsUniqueValidationOptions;

  constructor(options: IsUniqueValidationOptions) {
    this.options = options;
  }

  /**
   * Validates uniqueness
   * @param value - The value to check
   * @param args - Validation arguments
   * @returns True if unique
   */
  async validate(
    value: string | string[],
    { property, object }: ValidationArguments,
  ): Promise<boolean> {
    return this.getQuery({ property, object: object as BaseRequest, value });
  }

  async getQuery({ property, object, value }: IsUniqueValidationArgs) {
    if (this.options.query) {
      return this.options.query({ property, object, value });
    }

    const repository = this.getRepository(object);

    const where = this.getWhereOptions(value, property);

    if (this.options.except && object.params) {
      const id = object.params[this.options.except.param ?? 'id'];

      where[this.options.except.column ?? 'uuid'] = Not(id);
    }

    if (this.options.load) {
      return this.loadEntity({ property, object, value }, where);
    }

    return !(await repository.exist({ where }));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private getRepository(_object: BaseRequest): Repository<BaseEntity> {
    return this.options.entity.getRepository();
  }

  private async loadEntity(
    { property, object, value }: IsUniqueValidationArgs,
    where: FindOptionsWhere<BaseEntity> | Array<FindOptionsWhere<BaseEntity>>,
  ) {
    const repository = this.getRepository(object);

    const e = isArray(value)
      ? await repository.findBy(where)
      : await repository.findOneBy(where);

    if (e) {
      if (object.instances === undefined) {
        object.instances = {};
      }

      object.instances = { ...object.instances, [camelCase(property)]: e };
    }

    if (isArray(value) && isArray(e)) {
      return notEmpty(e) && e.length === value.length;
    }

    return notEmpty(e);
  }

  private getWhereOptions(
    value: string | string[],
    property: string,
  ): FindOptionsWhere<BaseEntity> | Array<FindOptionsWhere<BaseEntity>> {
    const whereOption = this.options.where;

    const whereValue = isArray(value)
      ? { [this.getColumn(property)]: In(value) }
      : { [this.getColumn(property)]: value };

    return { ...whereValue, ...whereOption } as
      | FindOptionsWhere<BaseEntity>
      | Array<FindOptionsWhere<BaseEntity>>;
  }

  private getColumn(property = 'uuid'): string {
    return this.options.column ?? property;
  }

  /**
   * Error message if not unique
   */
  defaultMessage({ property }: ValidationArguments) {
    return `${property} is already exists`;
  }
}

/**
 * Decorator function for class-validator uniqueness validation
 * @param options - Validation options
 * @returns Decorator function
 */
export function IsUnique(
  options: IsUniqueValidationOptions,
  validationOptions?: ValidationOptions,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (object: any, propertyName: string) {
    const defaultMessage = () => `${propertyName} is already exist`;
    validationOptions = {
      ...validationOptions,
      // Use a custom message or a function that returns a custom message
      message: validationOptions?.message || defaultMessage,
    };
    /**
     * Registers the decorator metadata
     */
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: new IsUniqueValidation(options),
    });
  };
}
