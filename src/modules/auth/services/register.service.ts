import { ConflictException, Injectable } from '@nestjs/common';
import { User } from 'src/entities/users/user.entity';
import { UsersService } from '../../users/services/users.service';
import { RegisterRequestDto } from '../requests/register-request.dto';

@Injectable()
export class RegisterService {
  constructor(private usersService: UsersService) {}

  async registerUser(body: RegisterRequestDto) {
    await this.checkEmailAvailability(body);

    const user = this.usersService.create(body);

    return await this.usersService.save(user);
  }
  async checkEmailAvailability({ email }: RegisterRequestDto) {
    const user: User = await this.usersService.findByCondition({
      where: { email },
    });
    if (user) throw new ConflictException('Email already in use');
  }
}
