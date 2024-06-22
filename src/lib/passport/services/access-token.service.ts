import { CrudService } from 'src/lib/services/crud.service';
import type { BaseEntity } from 'typeorm';

export abstract class AccessTokenService<
  T extends BaseEntity,
> extends CrudService<T> {}
