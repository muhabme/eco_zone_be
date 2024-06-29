import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/entities/users/user.entity';
import { UsersService } from '../../users/services/users.service';
import { LoginRequestDto } from '../requests/login-request.dto';
import { AccessTokenService } from './access-token.service';

@Injectable()
export class LoginService {
  constructor(
    private usersService: UsersService,
    private accessTokenService: AccessTokenService,
  ) {}

  async attemptLogin(body: LoginRequestDto) {
    const user = await this.findUser(body);

    await this.validatePassword(user, body);

    const token = await this.accessTokenService.generateToken(user);

    return { user, token };
  }

  protected async findUser({ username }: LoginRequestDto) {
    let user: User;
    if (this.isEmail(username)) {
      user = await this.usersService.findByCondition({
        where: { email: username },
      });
    } else if (this.isMobile(username)) {
      user = await this.usersService.findByCondition({
        where: { mobile: username },
      });
    } else {
      throw new BadRequestException(
        'Username must be an email address or a mobile number.',
      );
    }

    if (!user) {
      throw new ConflictException("User doesn't expect");
    }

    return user;
  }

  protected async validatePassword(
    user: User | null,
    request: LoginRequestDto,
  ): Promise<void> {
    const isValidPassword = await user?.isValidPassword(request.password);

    if (!isValidPassword) throw new UnauthorizedException('Invalid password');
  }

  private isEmail(value: string): boolean {
    return /\S+@\S+\.\S+/.test(value);
  }

  private isMobile(value: string): boolean {
    return /^\+\d+$/.test(value);
  }
}
