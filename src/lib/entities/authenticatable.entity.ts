import { decorate, Mixin } from 'ts-mixer';
import { Column } from 'typeorm';

import { HasPassword, IHasPassword } from '../concerns/has-password';
import { BaseModelWithUuid } from './base-with-uuid.entity';

export class Authenticatable
  extends Mixin(BaseModelWithUuid, HasPassword)
  implements IHasPassword
{
  @decorate(Column({ unique: true }))
  email: string;
}
