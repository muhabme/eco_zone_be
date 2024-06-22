import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import {
  initializeTransactional,
  useApiPrefix,
  useClassValidator,
  useInterceptors,
} from './bootstrap';

async function bootstrap() {
  initializeTransactional();

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());

  useInterceptors(app);
  useApiPrefix(app, configService);
  useClassValidator(app);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const port = configService.getOrThrow('app.port', { infer: true });
  await app.listen(port as number);
}
bootstrap();
