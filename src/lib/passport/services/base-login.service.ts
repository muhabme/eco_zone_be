import { UnauthorizedException } from '@nestjs/common';
import { Authenticatable } from 'src/lib/entities/authenticatable.entity';
import { toBoolean } from 'src/lib/helpers/boolean';
import { now } from 'src/lib/helpers/date';
import { LoginRequest } from 'src/modules/auth/requests/user-login-request.dto';
import { VerifyLoginRequest } from 'src/modules/auth/responses/verify-login.response';
import { DeepPartial } from 'typeorm';
import { AccessToken } from '../entities/access-token.entity';
import { AuthUserTypes } from '../types/jwt-payload.interface';
import { AccessTokenService } from './access-token.service';
import { TokenService } from './token.service';

export abstract class BaseLoginService<T extends AccessToken> {
  constructor(
    protected tokenService: TokenService,
    protected accessTokenService: AccessTokenService<T>,
  ) {}

  abstract findAuthenticatableFrom(
    request: LoginRequest | VerifyLoginRequest,
  ): Promise<Authenticatable>;

  async attemptLogin({
    request,
    userType,
    ip,
  }: {
    request: LoginRequest;
    userType: AuthUserTypes;
    ip: string;
  }) {
    const user = await this.findAuthenticatableFrom(request);

    await this.validatePassword(user, request);

    const token = await this.generateToken({ user, userType, ip });

    return { token, user };
  }

  protected async generateToken({
    user,
    userType,
    ip,
  }: {
    user: Authenticatable;
    userType: AuthUserTypes;
    ip: string;
  }): Promise<string> {
    const expiresIn = TokenService.expiresInMilliseconds();

    const accessToken = await this.createAccessToken({
      ip,
      user,
      userType,
      expiresIn,
    });

    return this.tokenService.generateToken(accessToken);
  }

  async createAccessToken({
    user,
    userType,
    expiresIn,
    ip,
  }: {
    user: Authenticatable;
    userType: AuthUserTypes;
    expiresIn: number;
    ip: string;
  }): Promise<T> {
    const accessToken = await this.accessTokenService.create({
      user_id: user.id,
      user_type: userType,
      ip,
      expires_at: now().add(expiresIn).toDate(),
    } as DeepPartial<T>);

    accessToken.setUser(user.toObject());

    return accessToken;
  }

  protected async validatePassword(
    user: Authenticatable | null,
    request: LoginRequest | VerifyLoginRequest,
  ): Promise<void> {
    if (!toBoolean(await user?.isValidPassword(request.password)))
      throw new UnauthorizedException('InvalidCredentials');
  }
}
