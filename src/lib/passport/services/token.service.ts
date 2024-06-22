import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Milliseconds } from 'cache-manager';
import { Request } from 'express';
import { toMilliseconds } from 'src/lib/helpers/ms';
import { Env } from 'src/lib/utils/env';
import { AccessToken } from '../entities/access-token.entity';
import { IJwtPayload } from '../types/jwt-payload.interface';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  private sign(payload: IJwtPayload, options?: JwtSignOptions) {
    return this.jwtService.sign(payload, options);
  }
  static expiresInMilliseconds(): Milliseconds {
    const env = Env.get('JWT_EXPIRES_IN').asString();

    return toMilliseconds(env);
  }

  findFromRequest(request: Request): string | undefined {
    return request.cookies.access_token;
  }

  findFromRequestOrFail(request: Request): string {
    const jwtToken = this.findFromRequest(request);

    if (jwtToken === undefined) {
      throw new UnauthorizedException('Unauthenticated');
    }

    return jwtToken as string;
  }

  async generateToken(accessToken: AccessToken): Promise<string> {
    const payload: IJwtPayload = {
      id: accessToken.getUser().uuid,
      type: accessToken.user_type,
      tokenId: accessToken.uuid,
    };

    return this.sign(payload);
  }
}
