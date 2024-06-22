export interface AllConfigType {
  app: AppConfig;
  database: DatabaseConfig;
  jwt: JWTConfig;
}

export interface AppConfig {
  nodeEnv: string;
  name: string;
  backendDomain: string;
  port: number;
  apiPrefix: string;

  // locale: string;
  // fallbackLocale: string;
  // debug: boolean;
  // appUrl: string;
}

export interface DatabaseConfig {
  dialect: string;
  synchronize?: boolean;
  name?: string;

  host?: string;
  port?: number;
  password?: string;
  username?: string;
  logging: boolean;
}

export interface JWTConfig {
  secret: string;
  expiresIn: string;
}

export interface AuthConfig {
  secret: string;
  expiresIn: string;
}
