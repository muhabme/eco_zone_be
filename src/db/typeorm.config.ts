import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { toBoolean } from 'src/lib/helpers/boolean';
import { DataSource, DataSourceOptions } from 'typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const synchronize = this.configService.get('db.synchronize', {
      infer: true,
    });

    return {
      type: this.configService.get('db.type', { infer: true }),
      host: this.configService.get('db.host', { infer: true }),
      port: this.configService.get('db.port', { infer: true }),
      username: this.configService.get('db.username', { infer: true }),
      password: this.configService.get<string>('db.password', { infer: true }),
      database: this.configService.get('db.name', { infer: true }),
      synchronize: toBoolean(synchronize),
      logging: this.configService.get('db.logging', { infer: true }),
      dropSchema: false,
      keepConnectionAlive: true,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      cli: {
        entitiesDir: 'src',
        migrationsDir: 'src/database/migrations',
        seedsDir: 'src/database/seeds',
      },
    } as TypeOrmModuleOptions;
  }
}

export const typeOrmDataSourceFactory = async (options: DataSourceOptions) => {
  try {
    const dataSource = await new DataSource(options).initialize();
    console.log('Database connected successfully. ✅');

    return dataSource;
  } catch (error) {
    console.log('Error connecting to database');
    throw error;
  }
};
