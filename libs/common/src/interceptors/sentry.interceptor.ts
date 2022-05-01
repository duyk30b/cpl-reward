import {
  ExecutionContext,
  Injectable,
  NestInterceptor,
  CallHandler,
  HttpException,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import * as Sentry from '@sentry/minimal'
import { ValidationException } from '../exceptions/validation.exception'

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(null, (exception) => {
        const ignoreExceptions = [ValidationException, HttpException]
        if (!ignoreExceptions.some((type) => exception instanceof type)) {
          Sentry.captureException(exception)
        }
      }),
    )
  }
}
