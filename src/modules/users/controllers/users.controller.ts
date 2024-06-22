import { Controller } from '@nestjs/common';
import { Serialize } from 'src/lib/interceptors/serialize.interceptor';
import { UserResponseDto } from '../responses/user.dto';
import { UsersService } from '../services/users.service';

@Controller('auth')
@Serialize(UserResponseDto)
export class UsersController {
  constructor(private usersService: UsersService) {}
}
