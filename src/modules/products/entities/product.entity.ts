import { ToOptionItem } from 'src/lib/concerns/to-option-item';
import { BaseModelWithUuid } from 'src/lib/entities/base-with-uuid.entity';
import { decorate, Mixin } from 'ts-mixer';
import { Column, Entity, FindOptionsSelect } from 'typeorm';

@Entity({ name: 'products' })
export class Product extends Mixin(BaseModelWithUuid, ToOptionItem) {
  getLabelForOption(): string {
    return `${this.name}`;
  }
  static selectForOptionItem(): FindOptionsSelect<Product> {
    return {
      uuid: true,
      name: true,
    };
  }

  @decorate(Column({ type: 'varchar', length: 255, nullable: true }))
  name: string;
}
