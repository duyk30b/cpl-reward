import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common'
import { ValidationException } from '@app/common/exceptions/validation.exception'
import { Request, Response } from 'express'

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  async catch(exception: ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()
    const msg = exception.getMessage()
    const errors = exception.getErrors()

    response.status(status).json({
      statusCode: status,
      msg: msg,
      errors: errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    })
  }
}
