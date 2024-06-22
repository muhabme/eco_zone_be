import { ConfigService } from '@nestjs/config';
import type { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const jwtFactory: JwtModuleAsyncOptions = {
  useFactory: (configService: ConfigService) => ({
    global: true,
    secret: configService.get('jwt.secret'),
    signOptions: {
      expiresIn: `${configService.get('jwt.expiresIn')}`,
    },
  }),
  inject: [ConfigService],
};
