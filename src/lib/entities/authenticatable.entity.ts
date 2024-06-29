import * as bcrypt from 'bcrypt';
import { Exclude, Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column } from 'typeorm';
import { BaseModel } from './base.entity';

const bcryptHashRegex = /^\$2[aby]\$[0-9]{2}\$[A-Za-z0-9/.]{53}$/;

export abstract class BaseAuthenticatableModel extends BaseModel {
  @Column({ nullable: true, unique: true })
  @Transform((value) => value || undefined, { toClassOnly: true })
  @IsNotEmpty({ message: 'Either email or mobile is required' })
  email: string;

  @Column({ nullable: true, unique: true })
  @Transform((value) => value || undefined, { toClassOnly: true })
  @IsNotEmpty({ message: 'Either email or mobile is required' })
  mobile: string;

  @Column({ type: 'boolean', default: false })
  is_2Fa_enabled: boolean;

  @Column({ type: 'varchar' })
  @Exclude({ toPlainOnly: true })
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashingPassword() {
    if (this.password && !bcryptHashRegex.test(this.password)) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async isValidPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
