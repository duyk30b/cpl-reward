import { Environment } from '@lib/common'
import { SentryInterceptor } from '@lib/common/interceptors/sentry.interceptor'
import { KafkaConsumerService } from '@libs/kafka-libs/kafka-consumer.service'
import { getAllControllers } from '@libs/utils'
import { Logger, LogLevel } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import * as Sentry from '@sentry/node'
import { EventDispatcherModule } from './event-dispatcher.module'

async function bootstrap() {
  const logger = new Logger('bootstrap')

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    EventDispatcherModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: process.env.KAFKA_GROUP_ID + '-client',
          brokers: (process.env.KAFKA_BORKERS || '').split(','),
        },
        consumer: {
          groupId: process.env.KAFKA_GROUP_ID,
          allowAutoTopicCreation: true,
        },
      },
    },
  )

  app.get(KafkaConsumerService).processKafkaDecorators(getAllControllers(app))

  const configService: ConfigService = app.get(ConfigService)
  const ENV = configService.get('global.env') || Environment.Local

  const logLevel: LogLevel[] =
    ENV == Environment.Local || ENV == Environment.Development
      ? ['debug', 'error', 'log', 'verbose', 'warn']
      : ['error', 'warn', 'log']
  app.useLogger(logLevel)

  if (ENV != Environment.Local) {
    const SENTRY_DSN = configService.get('global.sentryDsn')
    Sentry.init({ dsn: SENTRY_DSN, environment: ENV })
    app.useGlobalInterceptors(new SentryInterceptor())
  }

  await app.listen()
  logger.debug(`===== [REWARD-${ENV}]: Service event-dispatcher started =====`)
}
bootstrap()
