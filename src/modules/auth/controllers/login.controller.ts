import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Serialize } from 'src/lib/interceptors/serialize.interceptor';
import { UserResponseDto } from 'src/modules/users/responses/user-response.dto';
import { LoginRequestDto } from '../requests/login-request.dto';
import { AccessTokenService } from '../services/access-token.service';
import { LoginService } from '../services/login.service';

@Controller('auth')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login')
  @Serialize(UserResponseDto)
  async login(
    @Body() body: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, user } = await this.loginService.attemptLogin(body);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + AccessTokenService.getExpiresInMs()),
    });

    return user;
  }

  @Get('whoami')
  async whoAmI(@Req() req: Request) {
    return req.user;
  }
}
