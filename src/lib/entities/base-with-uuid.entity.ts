import { Mixin } from 'ts-mixer';
import type { FindOptionsWhere } from 'typeorm';

import { HasUuid, IHasUuid } from '../concerns/has-uuid';
import { BaseModel } from './base.entity';

export class BaseModelWithUuid
  extends Mixin(BaseModel, HasUuid)
  implements IHasUuid
{
  /**
   * Find the ID of an entity given its UUID.
   * @param uuid - The UUID of the entity.
   * @param extraWhereOptions - Additional query conditions.
   * @returns The ID of the entity.
   * @throws Will throw an error if the entity is not found.
   */
  static async uuidToId<
    T extends typeof BaseModelWithUuid,
    U = InstanceType<T>,
  >(
    this: T,
    uuid: string,
    extraWhereOptions?: FindOptionsWhere<U>,
  ): Promise<number> {
    const entity = await this.findOneOrFail({
      where: {
        ...extraWhereOptions,
        uuid,
      },
    });

    return entity.id;
  }
}
