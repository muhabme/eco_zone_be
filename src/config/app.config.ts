import { registerAs } from '@nestjs/config';
import { AppConfig } from 'src/common/types/config';

import { Env } from 'src/lib/utils/env';

export default registerAs<AppConfig>('app', () => ({
  nodeEnv: Env.get('NODE_ENV').asString(),
  name: Env.get('APP_NAME').asString(),
  backendDomain: Env.get('BACKEND_DOMAIN').asString(),
  port: Env.get('NODE_SERVICE_PORT').asPort(),
  apiPrefix: Env.get('API_PREFIX').asString(),
  //   locale: Env.get('APP_LOCALE').asString(),
  //   fallbackLocale: Env.get('APP_FALLBACK_LOCALE').asString(),
  //   debug: Env.get('APP_DEBUG').asBoolean(),
  //   appUrl: Env.get('APP_URL').asString(),
}));
