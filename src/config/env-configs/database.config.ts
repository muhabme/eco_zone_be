import { registerAs } from '@nestjs/config';
import { Env } from 'src/lib/utils/env';

export default registerAs('db', () => ({
  type: Env.get('DB_TYPE').asString(),
  host: Env.get('DB_HOST').asString(),
  port: Env.get('DB_PORT').asPort(),
  password: Env.get('DB_PASSWORD').asString(),
  name: Env.get('DB_NAME').asString(),
  username: Env.get('DB_USERNAME').asString(),
  synchronize: Env.get('DB_SYNCHRONIZE').asBoolean(),
  logging: Env.get('DB_LOGGING').asBoolean(),
}));
