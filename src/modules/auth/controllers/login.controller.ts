import { Body, Controller, Headers, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { now } from 'src/lib/helpers/date';
import { TokenService } from 'src/lib/passport/services/token.service';
import { UserResponseDto } from 'src/modules/users/responses/user.dto';
import { LoginRequest } from '../requests/user-login-request.dto';
import { UserLoginService } from '../services/user-login.service';

@Controller('/auth')
export class LoginController {
  constructor(
    private readonly loginService: UserLoginService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('login')
  async login(
    @Headers('x-user-ip') ip: string,
    @Body() body: LoginRequest,
    @Req() request: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, user: user } = await this.loginService.attemptLogin({
      request: body,
      userType: 'user',
      ip: ip ?? request.ip,
    });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: now().add(TokenService.expiresInMilliseconds()).toDate(),
    });

    return {
      data: user.transform(UserResponseDto),
    };
  }
}
