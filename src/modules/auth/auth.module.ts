import { Module } from '@nestjs/common';
import { TokenService } from 'src/lib/passport/services/token.service';
import { UsersModule } from '../users/users.module';
import { LoginController } from './controllers/login.controller';
import { RegisterController } from './controllers/register.controller';
import { RegisterService } from './services/register.service';
import { UserAccessTokenService } from './services/user-access-token.service';
import { UserLoginService } from './services/user-login.service';

@Module({
  imports: [UsersModule],
  controllers: [LoginController, RegisterController],
  providers: [
    UserLoginService,
    RegisterService,
    TokenService,
    UserAccessTokenService,
  ],
  exports: [UserLoginService, TokenService],
})
export class AuthModule {}
