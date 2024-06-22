import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { RequestInterceptor } from './common/interceptors/request.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { RequestKeysPipe } from './lib/pipes/normalize-request-keys.pipe';

export function useApiPrefix(
  app: INestApplication,
  configService: ConfigService<unknown, boolean>,
) {
  const prefix = configService.getOrThrow('API_PREFIX', { infer: true });

  app.setGlobalPrefix(prefix as string, {
    exclude: ['/'],
  });
}

export function initializeTransactional() {
  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
}

export function useClassValidator(app: INestApplication) {
  app.useGlobalPipes(new RequestKeysPipe({ body: true }));
}

export function useInterceptors(app: INestApplication) {
  app.useGlobalInterceptors(
    new ResponseInterceptor(),
    new RequestInterceptor(),
  );
}
