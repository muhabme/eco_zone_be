import { decorate } from 'ts-mixer';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export interface IHasTimestamp {
  created_at: Date;
  updated_at: Date;
}

/**
 * Mixin class that adds timestamps to entities
 */
export class HasTimestamp implements IHasTimestamp {
  @decorate(CreateDateColumn())
  created_at: Date;

  @decorate(UpdateDateColumn())
  updated_at: Date;
}
