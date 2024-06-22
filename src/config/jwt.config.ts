import { registerAs } from '@nestjs/config';

import { Env } from 'src/lib/utils/env';
import type { JWTConfig } from '../common/types/config';

export default registerAs<JWTConfig>('jwt', () => ({
  secret: Env.get('JWT_SECRET').asString(),
  expiresIn: Env.get('JWT_EXPIRES_IN').asString(),
}));
