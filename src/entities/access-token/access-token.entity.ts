import { BaseAuthenticatableModel } from 'src/lib/entities/authenticatable.entity';
import { BaseModel } from 'src/lib/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity({ name: 'access-tokens' })
export class AccessToken extends BaseModel {
  @Column({ type: 'datetime', nullable: false })
  expires_at: Date;

  @Column({ type: 'datetime', nullable: true })
  revoked_at: Date;

  @Column('bigint')
  user_id: number;

  @ManyToOne(() => User, (user: User) => user.access_tokens)
  user: User;

  getUser(): BaseAuthenticatableModel {
    return this.user;
  }

  setUser(user: BaseAuthenticatableModel): this {
    this.user = user as User;

    return this;
  }
}
