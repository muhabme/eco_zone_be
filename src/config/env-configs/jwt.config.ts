import { Env } from '@lib/utils/env';
import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: Env.get('JWT_SECRET').asString(),
  expiresIn: Env.get('JWT_EXPIRES_IN').asString(),
}));
