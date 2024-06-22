import { config } from 'dotenv';
import { Env } from 'src/lib/utils/env';
import { DataSource } from 'typeorm';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';

config({ path: Env.envPaths()[0] });

const dataSource = new DataSource({
  type: 'mysql',
  host: Env.get('DATABASE_HOST').asString(),
  port: Env.get('DATABASE_PORT').asPort({ defaultPort: 3606 }),
  username: Env.get('DATABASE_USERNAME').asString(),
  password: Env.get('DATABASE_PASSWORD').asString(),

  // type: 'sqlite',
  // database: Env.get('DATABASE_NAME').asString(),

  // the seeder doesn't crash when this line is commented out
  // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
});

initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
addTransactionalDataSource(dataSource);

export default dataSource;
