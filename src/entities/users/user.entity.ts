import { Column, Entity, OneToMany } from 'typeorm';
import { BaseAuthenticatableModel } from '../../lib/entities/authenticatable.entity';
import { AccessToken } from '../access-token/access-token.entity';

@Entity({ name: 'users' })
export class User extends BaseAuthenticatableModel {
  @Column({ type: 'varchar', length: 255 })
  full_name: string;

  @Column({ type: 'date' })
  birth_date: Date;

  @OneToMany(() => AccessToken, (accessToken: AccessToken) => accessToken.user)
  access_tokens: AccessToken[];
}
