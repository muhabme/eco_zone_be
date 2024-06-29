import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Env } from 'src/lib/utils/env';

export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req.cookies.Authentication;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: Env.get('JWT_SECRET').asString(),
    });
  }

  async validate(payload: any) {
    return payload;
  }
}
