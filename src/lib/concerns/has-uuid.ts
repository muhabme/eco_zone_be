import { decorate } from 'ts-mixer';
import { BeforeInsert, Column } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export interface IHasUuid {
  uuid: string;
}

export class HasUuid implements IHasUuid {
  // @decorate(
  //   Column({
  //     type: 'varchar',
  //     length: 36,
  //     default: () => '(UUID())',
  //   }),
  // )
  // uuid: string;

  @decorate(Column({ type: 'uuid', unique: true }))
  uuid: string;

  @decorate(BeforeInsert())
  generateUuid() {
    if (!this.uuid) {
      this.uuid = uuidv4();
    }
  }
}
