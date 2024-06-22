import { Transformable } from 'src/lib/concerns/transformable';
import { Authenticatable } from 'src/lib/entities/authenticatable.entity';
import { BaseModelWithUuid } from 'src/lib/entities/base-with-uuid.entity';
import { GObj } from 'src/lib/helpers/object';
import { Mixin } from 'ts-mixer';
import { Column, Entity, TableInheritance } from 'typeorm';
import { AuthUserTypes } from '../types/jwt-payload.interface';

@Entity('access_tokens')
@TableInheritance({ column: { type: 'varchar', name: 'user_type' } })
export abstract class AccessToken extends Mixin(
  BaseModelWithUuid,
  Transformable,
) {
  @Column({ type: 'datetime', nullable: false })
  expires_at: Date;

  @Column({ type: 'datetime', nullable: true })
  revoked_at: Date;

  @Column({ type: 'varchar' })
  user_type: AuthUserTypes;

  @Column({ type: 'varchar' })
  ip: string;

  last_used_at: Date;

  @Column('bigint')
  user_id: number;

  abstract getUser(): Authenticatable;

  abstract setUser(user: Authenticatable | GObj): this;
}
