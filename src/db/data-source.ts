import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Env } from '../lib/utils/env';

config({ path: Env.envFilePath() });

const dataSource = new DataSource({
  type: 'mysql',
  host: Env.get('DB_HOST').asString(),
  port: Env.get('DB_PORT').asPort({ defaultPort: 3606 }),
  username: Env.get('DB_USERNAME').asString(),
  password: Env.get('DB_PASSWORD').asString(),
  database: Env.get('DB_NAME').asString(),
  multipleStatements: true,
  logging: true,
  entities: ['**/*.entity{ .ts,.js}'],
  migrations: ['src/db/migrations/**/*{.ts,.js}'],
});

export default dataSource;
