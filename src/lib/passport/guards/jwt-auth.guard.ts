import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserAccessTokenService } from 'src/modules/auth/services/user-access-token.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { TokenService } from '../services/token.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private tokenService: TokenService,
    private accessTokenService: UserAccessTokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = this.getRequest(context);
    const token = this.tokenService.findFromRequestOrFail(request);

    try {
      const payload = await this.jwtService.verifyAsync(token);
      await this.accessTokenService.firstOrFail({
        uuid: payload.tokenId,
      });
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('TokenExpired');
      }
      if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('ForbiddenException');
      }
      throw new UnauthorizedException('Unauthenticated');
    }

    return true;
  }

  private getRequest(context: ExecutionContext): Request {
    return context.switchToHttp().getRequest<Request>();
  }
}
