import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain } from 'class-transformer';
import * as toMilliseconds from 'ms';
import { AccessToken } from 'src/entities/access-token/access-token.entity';
import { User } from 'src/entities/users/user.entity';
import { CrudService } from 'src/lib/services/crud.service';
import { Env } from 'src/lib/utils/env';

@Injectable()
export class AccessTokenService extends CrudService<AccessToken> {
  constructor(private jwtService: JwtService) {
    super(AccessToken);
  }

  static getExpiresInMs(): number {
    return toMilliseconds(Env.get('JWT_EXPIRES_IN').asString());
  }

  async generateToken(user: User) {
    const expiresIn = AccessTokenService.getExpiresInMs();
    const accessToken = await this.createToken({ user, expiresIn });

    const payload = {
      id: accessToken.getUser().uuid,
      tokenId: accessToken.uuid,
    };

    return this.jwtService.sign(payload);
  }

  protected async createToken({
    user,
    expiresIn,
  }: {
    user: User;
    expiresIn: number;
  }) {
    const accessToken = this.create({
      user_id: user.id,
      expires_at: new Date(Date.now() + expiresIn),
    });

    accessToken.save();

    accessToken.setUser(instanceToPlain(user) as User);

    return accessToken;
  }
}
