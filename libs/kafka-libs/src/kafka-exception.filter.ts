import { ValidationException } from '@libs/utils/exception-filters/validation-exception.filter'
import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common'
import { KafkaContext, RpcException } from '@nestjs/microservices'
import * as Sentry from '@sentry/minimal'

@Catch(ValidationException)
export class KafkaValidationExeptionFilter implements ExceptionFilter {
  private logger = new Logger(KafkaValidationExeptionFilter.name)

  catch(exception: ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToRpc().getContext<KafkaContext>()
    const topic = ctx.getTopic()
    const msg = `KAFKA VALIDATION ERROR FOR TOPIC: ${topic}`

    this.logger.error(msg)
    this.logger.error({
      message: ctx.getMessage().value,
      errors: exception.getErrors(),
    })
    Sentry.captureException(new Error(msg))
  }
}
