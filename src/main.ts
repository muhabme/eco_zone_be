import * as cookieParser from 'cookie-parser';
import 'reflect-metadata';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SnakeCaseNormalizerPipe } from './lib/pipes/snake-case-normalizer.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());

  // Pipes
  app.useGlobalPipes(new SnakeCaseNormalizerPipe(), new ValidationPipe());

  // Prefix
  const prefix = configService.getOrThrow('app.prefix', { infer: true });
  app.setGlobalPrefix(prefix as string, {
    exclude: ['/'],
  });

  const port = configService.getOrThrow('app.port', { infer: true });
  await app.listen(port);
}
bootstrap();
