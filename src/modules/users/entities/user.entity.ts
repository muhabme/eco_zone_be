import { Authenticatable } from 'src/lib/entities/authenticatable.entity';
import { UserAccessToken } from 'src/modules/auth/entities/user-access-token.entity';
import { decorate } from 'ts-mixer';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'users' })
export class User extends Authenticatable {
  @decorate(Column({ type: 'varchar', length: 255, nullable: true }))
  full_name: string;

  @decorate(Column({ type: 'date', nullable: true }))
  birth_date: Date;

  @OneToMany(() => UserAccessToken, (token) => token.user)
  access_tokens?: UserAccessToken[];
}
