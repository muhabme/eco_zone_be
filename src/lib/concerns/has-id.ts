import { decorate } from 'ts-mixer';
import { PrimaryGeneratedColumn } from 'typeorm';

export interface IHasId {
  id: number;
}

export class HasId {
  @decorate(PrimaryGeneratedColumn())
  id: number;
}
