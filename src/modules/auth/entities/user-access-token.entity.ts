import { ChildEntity, JoinColumn, ManyToOne } from 'typeorm';

import { Authenticatable } from 'src/lib/entities/authenticatable.entity';
import { AccessToken } from 'src/lib/passport/entities/access-token.entity';
import { User } from 'src/modules/users/entities/user.entity';

@ChildEntity('user')
export abstract class UserAccessToken extends AccessToken {
  @ManyToOne(() => User, (e) => e.access_tokens)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: User;

  getUser(): Authenticatable {
    return this.user;
  }

  setUser(user: Authenticatable): this {
    this.user = user as User;

    return this;
  }
}
