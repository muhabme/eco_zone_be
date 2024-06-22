import { Exclude } from 'class-transformer';
import { decorate } from 'ts-mixer';
import { BeforeInsert, BeforeUpdate, Column } from 'typeorm';

import { hashPassword, validateHash } from '../utils/passwords';
export interface IHasPassword {
  password: string;
}

/**

A mixin that adds password hashing capabilities to entities.
Implements the IHasPassword interface.
*/
export class HasPassword implements IHasPassword {
  @decorate(Column({ type: 'varchar' }))
  @decorate(Exclude({ toPlainOnly: true }))
  password: string;

  @decorate(BeforeInsert())
  @decorate(BeforeUpdate())
  hashingPassword() {
    if (this.password) {
      // if hashed password, skip
      if (this.password.includes('$2b$')) {
        return;
      }

      this.password = hashPassword(this.password);
    }
  }

  async isValidPassword(password: string) {
    return validateHash(password, this.password);
  }
}
