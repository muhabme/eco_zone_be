import { BadRequestException } from '@nestjs/common';
import { merge, toNumber } from 'lodash';
import {
  BaseEntity,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  InsertResult,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ToOptionItem } from '../concerns/to-option-item';
import { ModelCollection } from '../entities/collection.entity';
import { empty } from '../helpers/boolean';
import { GKey } from '../helpers/object';
import { ItemQueryBuilder } from '../query-builder/item-query-builder';
import { ListQueryBuilder } from '../query-builder/list-query-builder';
import { ItemQueryParams } from '../query-builder/requests/item-query.params';
import { ListQueryParams } from '../query-builder/requests/list-query.params';
import { OptionItem } from '../responses/response.type';
import { FindOptions } from '../type-orm/concerns/find-options';
import { TypeOrmFindOptionsMerger } from '../type-orm/helpers/FindOptionsMerger.helper';

export interface RemoveOptions {
  except: { values: unknown[]; key?: string };
}

export interface UpdateOptions {
  except: { values: unknown[]; key?: string };
}

export interface DefaultValues<T extends BaseEntity> {
  attributes?: DeepPartial<T>;
  findOptions?: FindManyOptions<T> | FindOneOptions<T>;
}

export interface CrudServiceOptions<T extends BaseEntity> {
  entity: typeof BaseEntity;
  itemQueryBuilder?: ItemQueryBuilder<T>;
  listQueryBuilder?: ListQueryBuilder<T>;

  removeOptions?: RemoveOptions;
  updateOptions?: UpdateOptions;

  defaults?: DefaultValues<T>;
}

export class CrudService<T extends BaseEntity> {
  protected model?: T | null;

  protected entity?: typeof BaseEntity;

  protected itemQueryBuilder?: ItemQueryBuilder<T>;

  protected listQueryBuilder?: ListQueryBuilder<T>;

  protected updateOptions?: UpdateOptions;

  protected removeOptions?: RemoveOptions;

  protected defaultFindOptions?: DefaultValues<T>['findOptions'];

  protected defaultAttributes?: DefaultValues<T>['attributes'];

  constructor(options: CrudServiceOptions<T>) {
    this.entity = options.entity;

    this.itemQueryBuilder = options.itemQueryBuilder;
    this.listQueryBuilder = options.listQueryBuilder;

    this.removeOptions = options.removeOptions;
    this.updateOptions = options.updateOptions;

    this.defaultFindOptions = options.defaults?.findOptions;
    this.defaultAttributes = options.defaults?.attributes;
  }

  async create(attributes: DeepPartial<T>): Promise<T>;
  async create(items: Array<DeepPartial<T>>): Promise<T[]>;

  async create(
    attributes: DeepPartial<T> | Array<DeepPartial<T>>,
  ): Promise<T | T[]> {
    attributes = this.getAttributes(attributes);

    if (Array.isArray(attributes)) {
      return this.createMultiple(attributes);
    }

    const item = await this.getRepository().create(attributes);
    return item.save();
  }

  protected async createMultiple(
    attributes: Array<DeepPartial<T>>,
  ): Promise<T[]> {
    const createdItems = this.getRepository().create(attributes);

    for await (const itemToSave of createdItems) {
      await itemToSave.save();
    }

    return createdItems;
  }

  async find(options?: FindManyOptions<T>): Promise<T[]> {
    options = this.getFindOptions(options);

    return this.getEntity().buildQuery(options).getMany();
  }

  async findAsOptions(
    keyColumn: string,
    options?: FindManyOptions<T>,
    params?: ListQueryParams,
  ): Promise<OptionItem[]> {
    const p = this.listQueryBuilder?.parseParams(params);

    delete p?.take;
    delete p?.skip;

    options = this.getFindOptions(
      merge({}, options, p, this.getEntity().selectForOptionItem()),
    );

    const items = await this.find(options);

    if (empty(items)) {
      return [];
    }

    return items.map((b) =>
      (b as unknown as ToOptionItem).toOptionItem(keyColumn),
    );
  }

  async findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]> {
    options = this.getFindOptions(options);

    return this.getEntity().buildQuery(options).getManyAndCount();
  }

  async firstOrFail(
    where: FindOptionsWhere<T>,
    options: FindOneOptions<T> = {},
    params?: ItemQueryParams,
  ): Promise<T> {
    const p = this.itemQueryBuilder?.parseParams(params);

    options = this.getFindOptions(merge({}, { where }, p, options));

    return this.getRepository().findOneOrFail(options);
  }

  async first(
    where: FindOptionsWhere<T>,
    options: FindOneOptions<T> = {},
    params?: ItemQueryParams,
  ): Promise<T | null> {
    const p = this.itemQueryBuilder?.parseParams(params);

    options = this.getFindOptions(merge({}, { where }, p, options));

    return this.getRepository().findOne(options);
  }

  async exists(
    where: FindOptionsWhere<T> | Array<FindOptionsWhere<T>>,
    options: FindOneOptions<T> = {},
  ): Promise<boolean> {
    options = this.getFindOptions({ ...options, where });

    return this.getRepository().exists(options);
  }

  async count(options?: FindManyOptions<T>): Promise<number> {
    options = this.getFindOptions(options);

    return this.getRepository().count(options);
  }

  async firstByAny(
    attributes: string[],
    where: GKey | GKey[],
    options: FindOneOptions<T> = {},
  ): Promise<T | null> {
    options = this.getFindOptions(options) as FindOneOptions<T>;

    const selector = attributes.map((_a) => ({ [_a]: where }));

    if (Array.isArray(where)) {
      const query = this.getRepository().createQueryBuilder('e');

      for (const attribute of attributes) {
        query.orWhere(`e.${attribute} IN (:...values)`, { values: where });
      }

      return query.getOne() as Promise<T | null>;
    }

    const o = { ...options, where: selector } as FindOneOptions<BaseEntity>;

    return this.getRepository().findOne(o);
  }

  async paginate(params?: ListQueryParams, options?: FindManyOptions<T>) {
    const p = this.listQueryBuilder?.parseParams(params);

    options =
      this.getFindOptions(TypeOrmFindOptionsMerger.merge(options, p)) ?? {};

    const [items, total] = await this.findAndCount(options);

    return new ModelCollection(items, {
      total,
      currentPage: toNumber(params?.page) || 1,
      eachPage: toNumber(options.take ?? 15),
      lastPage: Math.ceil(total / toNumber(options.take ?? 15)),
    });
  }

  async update(
    e: T | FindOptionsWhere<T>,
    attributes: DeepPartial<T>,
    orFail?: true,
  ): Promise<T>;

  async update(
    e: T | FindOptionsWhere<T>,
    attributes: DeepPartial<T>,
    orFail: false,
  ): Promise<T | undefined>;

  async update(
    e: T | FindOptionsWhere<T>,
    attributes: DeepPartial<T>,
    orFail = true,
  ): Promise<T | undefined> {
    this.model = await this.parseEntity(e, orFail);

    if (!this.model) {
      return;
    }

    this.exceptNonUpdatableEntities();

    attributes = this.getAttributes(attributes);

    this.model = this.getRepository().merge(
      this.model,
      attributes,
    ) as unknown as T;

    return this.model.save();
  }

  async updateOrCreate(
    e: QueryDeepPartialEntity<T> | Array<QueryDeepPartialEntity<T>>,
    conflictPaths: string[],
  ): Promise<T> {
    const upsertResult: InsertResult = await this.getRepository().upsert(e, {
      conflictPaths,
    });

    return this.firstOrFail(upsertResult.identifiers[0] as FindOptionsWhere<T>);
  }

  async remove(
    e: T | FindOptionsWhere<T>,
    orFail = true,
  ): Promise<T | undefined> {
    this.model = await this.parseEntity(e, orFail);

    if (!this.model) {
      return;
    }

    this.exceptNonDeletableEntities();

    return this.model.remove();
  }

  private exceptNonUpdatableEntities() {
    if (this.updateOptions?.except !== undefined) {
      const { values, key } = this.updateOptions.except;

      const value = this.model[key ?? 'id'];

      if (values.includes(value)) {
        throw new BadRequestException('ResourceCannotBeUpdatedException');
      }
    }
  }

  private exceptNonDeletableEntities() {
    if (this.removeOptions?.except !== undefined) {
      const { values, key } = this.removeOptions.except;

      const value = this.model![key ?? 'id'];

      if (values.includes(value)) {
        throw new BadRequestException('ResourceCannotBeDeletedException');
      }
    }
  }

  async parseEntity(
    e: T | FindOptionsWhere<T>,
    orFail = true,
  ): Promise<T | null> {
    if (Object.prototype.hasOwnProperty.call(e, 'isModel')) {
      return e as T;
    }

    e = e as FindOptionsWhere<T>;

    return orFail ? this.firstOrFail(e) : this.first(e);
  }

  /** Used to get merged default find options added to the class and the given options */
  protected getFindOptions(
    options?: FindOneOptions<T>,
  ): FindOneOptions<T> | undefined;

  protected getFindOptions(
    options?: FindManyOptions<T>,
  ): FindManyOptions<T> | undefined;

  protected getFindOptions(
    options?: FindManyOptions<T> | FindOneOptions<T>,
  ): FindManyOptions<T> | FindOneOptions<T> | undefined {
    return TypeOrmFindOptionsMerger.merge(this.defaultFindOptions, options);
  }

  protected getAttributes(attributes: DeepPartial<T>): DeepPartial<T>;

  protected getAttributes(
    attributes: Array<DeepPartial<T>>,
  ): Array<DeepPartial<T>>;

  protected getAttributes(
    attributes: DeepPartial<T> | Array<DeepPartial<T>>,
  ): DeepPartial<T> | Array<DeepPartial<T>>;

  protected getAttributes(
    attributes: DeepPartial<T> | Array<DeepPartial<T>>,
  ): DeepPartial<T> | Array<DeepPartial<T>> {
    if (Array.isArray(attributes)) {
      return attributes.map((i) => ({ ...this.defaultAttributes, ...i }));
    }

    return { ...this.defaultAttributes, ...attributes };
  }

  createQueryBuilder(options?: { alias?: string; params?: ListQueryParams }) {
    const p = this.listQueryBuilder?.parseParams(options?.params);

    return this.getEntity()
      .getRepository()
      .createQueryBuilder(options?.alias)
      .setFindOptions(p as FindManyOptions<BaseEntity>);
  }

  protected getRepository() {
    const entity = this.getEntity();
    if (!entity) {
      throw new Error('Entity is not defined.');
    }
    return entity.getRepository() as Repository<T>;
  }

  protected getEntity() {
    if (!this.entity) {
      throw new Error('Entity is not defined.');
    }
    return this.entity as typeof BaseEntity &
      typeof ToOptionItem &
      typeof FindOptions &
      T;
  }
}
