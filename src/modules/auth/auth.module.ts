import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtModuleOptions } from 'src/config/jwt-module-options';
import { passportModuleOptions } from 'src/config/passport-module-options';
import { JwtAuthStrategy } from 'src/modules/auth/passport/strategies/jwt.strategy';
import { LocalAuthStrategy } from 'src/modules/auth/passport/strategies/local.strategy';
import { UsersModule } from '../users/users.module';
import { LoginController } from './controllers/login.controller';
import { RegisterController } from './controllers/register.controller';
import { AccessTokenService } from './services/access-token.service';
import { LoginService } from './services/login.service';
import { RegisterService } from './services/register.service';

@Module({
  imports: [
    UsersModule,
    PassportModule.registerAsync(passportModuleOptions),
    JwtModule.registerAsync(jwtModuleOptions),
  ],
  controllers: [RegisterController, LoginController],
  providers: [
    RegisterService,
    LoginService,
    AccessTokenService,
    LocalAuthStrategy,
    JwtAuthStrategy,
  ],
})
export class AuthModule {}
