import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtFactory } from '../auth/config/jwt.config';

@Global()
@Module({
  imports: [JwtModule.registerAsync(jwtFactory)],
  exports: [JwtModule],
})
export class CoreModule {}
