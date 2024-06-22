import { Exclude } from 'class-transformer';
import { Allow } from 'class-validator';
import { Mixin } from 'ts-mixer';
import { BaseEntity } from 'typeorm';

import { HasId } from '../concerns/has-id';
import { HasTimestamp, IHasTimestamp } from '../concerns/has-timestamp';
import { Transformable } from '../concerns/transformable';
import { FindOptions } from '../type-orm/concerns/find-options';

export class BaseModel
  extends Mixin(BaseEntity, HasTimestamp, Transformable, HasId, FindOptions)
  implements IHasTimestamp
{
  @Exclude()
  @Allow({ always: false })
  isModel = true;
}
