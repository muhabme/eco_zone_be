import { Env } from '@lib/utils/env';
import appConfig from './env-configs/app.config';
import databaseConfig from './env-configs/database.config';
import jwtConfig from './env-configs/jwt.config';

export const configModuleSetupOptions = {
  isGlobal: true,
  load: [appConfig, databaseConfig, jwtConfig],
  envFilePath: Env.envFilePath(),
};
