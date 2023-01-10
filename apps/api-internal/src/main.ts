import { ValidationException } from '@lib/common/exceptions/validation.exception'
import { SentryInterceptor } from '@lib/common/interceptors/sentry.interceptor'
import { Logger, ValidationError, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as Sentry from '@sentry/node'
import { ApiInternalModule } from './api-internal.module'
import { HttpExceptionFilter } from './exception-filter/http-exception.filter'
import { ValidationExceptionFilter } from './exception-filter/validation-exception.filter'

async function bootstrap() {
  const logger = new Logger('bootstrap')
  const app = await NestFactory.create(ApiInternalModule)

  app.enableCors()
  app.useGlobalPipes(
    new ValidationPipe({
      validateCustomDecorators: true,
      transform: true,
      validationError: {
        target: false,
        value: false,
      },
      transformOptions: {
        excludeExtraneousValues: true,
      },
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new ValidationException(validationErrors)
      },
    }),
  )

  app.useGlobalFilters(
    new ValidationExceptionFilter(),
    new HttpExceptionFilter(),
  )

  const configService = app.get(ConfigService)
  const ENV = configService.get('ENV') || 'dev'
  const URL_PREFIX = configService.get('URL_PREFIX')
  // Apply Swagger
  if (ENV == 'dev' || ENV == 'local') {
    const config = new DocumentBuilder()
      .setTitle('Reward API')
      .addServer(URL_PREFIX || '')
      .addBearerAuth(
        {
          type: 'http',
          description: 'Access token',
        },
        'access-token',
      )
      .setDescription('Bitcastle Reward API ')
      .setVersion('1.0')
      .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('document', app, document)
  }

  // Sentry
  const SENTRY_DSN = configService.get('common.sentry_dsn')
  Sentry.init({ dsn: SENTRY_DSN })
  app.useGlobalInterceptors(new SentryInterceptor())

  const port: number = configService.get<number>('common.reward_port')
  await app.listen(port, () => {
    logger.debug('===== REWARD: Service api-internal started =====')
  })
}
bootstrap()
