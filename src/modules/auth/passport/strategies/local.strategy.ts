import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LoginService } from '../../services/login.service';

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy) {
  constructor(protected loginService: LoginService) {
    super();
  }

  validate(username: string, password: string) {
    const user = this.loginService.attemptLogin({ username, password });
    if (!user) throw new UnauthorizedException();

    return user;
  }
}
