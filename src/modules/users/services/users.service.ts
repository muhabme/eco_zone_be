import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from 'src/lib/services/crud.service';
import { DeepPartial, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService extends CrudService<User> {
  constructor(@InjectRepository(User) private repo: Repository<User>) {
    super({ entity: User });
  }

  async create(attributes: DeepPartial<User>): Promise<User>;
  async create(items: Array<DeepPartial<User>>): Promise<User[]>;
  async create(
    attributes: DeepPartial<User> | Array<DeepPartial<User>>,
  ): Promise<User | User[]> {
    return super.create(attributes as User);
  }
}
