import { AuthStrategies } from 'src/modules/auth/config/auth.config';

export type AuthUserTypes = keyof typeof AuthStrategies;

export interface IJwtPayload {
  id: string;
  type: AuthUserTypes;
  tokenId: string;
}

export interface IJwtToken extends IJwtPayload {
  iat: number;
  exp: number;
}
