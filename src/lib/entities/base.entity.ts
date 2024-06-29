import { plainToClass } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseResponse } from '../responses/base.response';

export abstract class BaseModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 36,
    default: () => '(UUID())',
    unique: true,
  })
  uuid: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  transform<T extends BaseResponse>(classResponse: ClassConstructor): T {
    return plainToClass(classResponse, this, {
      excludeExtraneousValues: true,
    });
  }
}
