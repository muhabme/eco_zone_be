import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/services/users.service';
import { UserRegisterRequest } from '../requests/user-register-request.dto';

@Injectable()
export class RegisterService {
  constructor(private usersService: UsersService) {}

  async register(request: UserRegisterRequest) {
    const user = await this.usersService.create(request);

    return user;
  }
}
