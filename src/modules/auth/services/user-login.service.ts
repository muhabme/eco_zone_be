import { Injectable } from '@nestjs/common';
import { BaseLoginService } from 'src/lib/passport/services/base-login.service';
import { TokenService } from 'src/lib/passport/services/token.service';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/services/users.service';
import { UserAccessToken } from '../entities/user-access-token.entity';
import { LoginRequest } from '../requests/user-login-request.dto';
import { VerifyLoginRequest } from '../responses/verify-login.response';
import { UserAccessTokenService } from './user-access-token.service';

@Injectable()
export class UserLoginService extends BaseLoginService<UserAccessToken> {
  constructor(
    protected userService: UsersService,
    protected tokenService: TokenService,
    protected accessTokenService: UserAccessTokenService,
  ) {
    super(tokenService, accessTokenService);
  }

  async findAuthenticatableFrom(
    request: LoginRequest | VerifyLoginRequest,
  ): Promise<User> {
    const user = await this.userService.firstByAny(['email'], request.username);

    return user!;
  }
}
