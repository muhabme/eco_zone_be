import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import {
  TypeOrmConfigService,
  typeOrmDataSourceFactory,
} from 'src/db/typeorm.config';

export const typeOrmModuleOptions: TypeOrmModuleAsyncOptions = {
  useClass: TypeOrmConfigService,
  dataSourceFactory: typeOrmDataSourceFactory,
};
