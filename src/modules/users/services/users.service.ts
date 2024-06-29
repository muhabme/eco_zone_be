import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/users/user.entity';
import { CrudService } from 'src/lib/services/crud.service';
import { DeepPartial } from 'typeorm';

@Injectable()
export class UsersService extends CrudService<User> {
  constructor() {
    super(User);
  }

  public create(data: DeepPartial<User>): User {
    const userData: DeepPartial<User> = data;

    if (
      userData.birth_date &&
      !(userData.birth_date instanceof Date) &&
      typeof userData.birth_date !== 'object'
    ) {
      userData.birth_date = new Date(userData.birth_date);
    }

    const user = this.getRepository().create(data) as unknown as User;

    return user;
  }
}
