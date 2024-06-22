import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseSchema } from 'src/lib/responses/response.type';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((response: ResponseSchema): ResponseSchema => {
        const status =
          response.status || context.switchToHttp().getResponse().statusCode;
        context.switchToHttp().getResponse().status(status);

        return {
          status,
          ...response,
        };
      }),
    );
  }
}
