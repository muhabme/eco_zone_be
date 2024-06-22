import { registerAs } from '@nestjs/config';

import { Env } from 'src/lib/utils/env';
import type { DatabaseConfig } from '../common/types/config';

export default registerAs<DatabaseConfig>('database', () => ({
  dialect: Env.get('DATABASE_DIALECT').asString(),
  name: Env.get('DATABASE_NAME').asString(),
  synchronize: Env.get('DATABASE_SYNCHRONIZE').asBoolean(),

  host: Env.get('DATABASE_HOST').asString(),
  port: Env.get('DATABASE_PORT').asPort(),
  password: Env.get('DATABASE_PASSWORD').asString(),
  username: Env.get('DATABASE_USERNAME').asString(),
  logging: Env.get('DATABASE_LOGGING').asBoolean(),
}));
