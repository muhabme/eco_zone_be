/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Request } from 'express';
import type { Observable } from 'rxjs';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request: Request = context.switchToHttp().getRequest();

    this.appendCurrentUser(request);
    this.appendParams(request);
    this.appendIp(request);

    return next.handle();
  }

  private appendCurrentUser(request: any) {
    const user = request.user;

    if (user) {
      request.body.user = user;
    }
  }

  private appendParams(request: Request) {
    request.body.params = request.params;
  }

  private appendIp(request: Request) {
    const userIp = request.headers['x-user-ip'];

    request.body.ip = request.ip || userIp;
  }
}
