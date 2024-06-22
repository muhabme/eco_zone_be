import type {
  FindManyOptions as BaseFindManyOptions,
  FindOptionsRelations,
} from 'typeorm';

export interface FindManyOptions<Entity = unknown>
  extends BaseFindManyOptions<Entity> {
  countRelations?: FindOptionsRelations<Entity> | undefined;
}
