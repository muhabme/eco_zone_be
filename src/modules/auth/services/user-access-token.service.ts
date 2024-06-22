import { Injectable } from '@nestjs/common';
import { CrudService } from 'src/lib/services/crud.service';
import { BaseEntity } from 'typeorm';
import { UserAccessToken } from '../entities/user-access-token.entity';

@Injectable()
export class UserAccessTokenService extends CrudService<UserAccessToken> {
  constructor() {
    super({
      entity: UserAccessToken as unknown as typeof BaseEntity,
    });
  }
}
