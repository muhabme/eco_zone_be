import { Exclude } from 'class-transformer';
import { Allow, IsObject, IsOptional, IsString } from 'class-validator';
import { Mixin } from 'ts-mixer';

import { User } from 'src/modules/users/entities/user.entity';
import { Encodable } from '../concerns/encodable';
import { ToObject } from '../concerns/to-object';

export class BaseRequest extends Mixin(Encodable, ToObject) {
  @Exclude({ toPlainOnly: true })
  @IsOptional()
  @IsObject()
  @Allow({ always: false })
  user?: User;

  @Exclude({ toPlainOnly: true })
  @IsOptional()
  @IsObject()
  @Allow({ always: false })
  params?: Record<string, string>;

  @Exclude({ toPlainOnly: true })
  @IsOptional()
  @IsString()
  @Allow({ always: false })
  ip?: string;

  @Exclude({ toPlainOnly: true })
  @IsOptional()
  @IsObject()
  @Allow({ always: false })
  instances?: Record<string, unknown>;

  constructor() {
    super();
  }
}
