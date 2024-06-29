import { AuthModuleAsyncOptions } from '@nestjs/passport';

export const passportModuleOptions: AuthModuleAsyncOptions = {
  useFactory: () => ({
    defaultStrategy: 'jwt',
    session: false,
  }),
};
