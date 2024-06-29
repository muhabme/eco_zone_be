import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const jwtModuleOptions: JwtModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    global: true,
    secret: configService.get('jwt.secret'),
    signOptions: {
      expiresIn: `${configService.get('jwt.expiresIn')}`,
    },
  }),
};
