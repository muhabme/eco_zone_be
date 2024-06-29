import {
  BaseEntity,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
} from 'typeorm';

export abstract class CrudService<T extends BaseEntity> {
  protected constructor(protected entity: typeof BaseEntity) {}

  public create(data: DeepPartial<T>): T {
    return this.getRepository().create(
      data as DeepPartial<BaseEntity>,
    ) as unknown as T;
  }

  public createMany(items: Array<DeepPartial<T>>): T[] {
    return this.getRepository().create(
      items as DeepPartial<BaseEntity>[],
    ) as unknown as T[];
  }

  public async save(data: DeepPartial<T>): Promise<T> {
    return this.getRepository().save(
      data as DeepPartial<BaseEntity>,
    ) as unknown as Promise<T>;
  }

  public async saveMany(items: Array<DeepPartial<T>>): Promise<T[]> {
    return (await this.getRepository().save(
      items as DeepPartial<BaseEntity>[],
    )) as unknown as Promise<T[]>;
  }

  public async findOneById(id: any): Promise<T> {
    const options: FindOptionsWhere<T> = {
      id,
    } as FindOptionsWhere<T>;
    return (await this.getRepository().findOneBy(
      options as FindOptionsWhere<BaseEntity>,
    )) as unknown as Promise<T>;
  }

  public async findByCondition(filterCondition: FindOneOptions<T>): Promise<T> {
    return (await this.getRepository().findOne(
      filterCondition as FindOneOptions<BaseEntity>,
    )) as unknown as Promise<T>;
  }

  public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    return (await this.getRepository().find(
      relations as FindManyOptions<BaseEntity>,
    )) as unknown as Promise<T[]>;
  }

  public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return (await this.getRepository().find(
      options as FindManyOptions<BaseEntity>,
    )) as unknown as Promise<T[]>;
  }

  public async remove(data: T): Promise<T> {
    return (await this.getRepository().remove(data)) as unknown as Promise<T>;
  }

  public async preload(entityLike: DeepPartial<T>): Promise<T> {
    return (await this.getRepository().preload(
      entityLike,
    )) as unknown as Promise<T>;
  }

  protected getRepository() {
    return this.getEntity().getRepository();
  }

  protected getEntity() {
    if (!this.entity) throw new Error('No entity found');

    return this.entity as typeof BaseEntity & T;
  }
}
