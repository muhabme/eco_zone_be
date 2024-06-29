import { registerAs } from '@nestjs/config';
import { Env } from 'src/lib/utils/env';

export default registerAs('app', () => ({
  port: Env.get('PORT').asPort({ defaultPort: 6000 }),
  prefix: Env.get('API_PREFIX').asString(),
}));
