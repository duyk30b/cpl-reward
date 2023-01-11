import { Environment } from '@lib/common'
import { SentryInterceptor } from '@lib/common/interceptors/sentry.interceptor'
import { KafkaConsumerService } from '@libs/kafka-libs/kafka-consumer.service'
import { getAllControllers } from '@libs/utils'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { KafkaOptions, Transport } from '@nestjs/microservices'
import * as Sentry from '@sentry/node'
import { EventDispatcherModule } from './event-dispatcher.module'

async function bootstrap() {
  const logger = new Logger('bootstrap')
  const app = await NestFactory.create(EventDispatcherModule)

  const configService: ConfigService = app.get(ConfigService)
  const ENV = configService.get('global.env') || Environment.Local

  app.get(KafkaConsumerService).processKafkaDecorators(getAllControllers(app))

  app.connectMicroservice<KafkaOptions>(
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: configService.get<string>('kafka.client_id'),
          brokers: configService.get<string[]>('kafka.brokers'),
        },
        consumer: {
          groupId: configService.get<string>('kafka.group_id'),
          allowAutoTopicCreation: true,
        },
      },
    },
    { inheritAppConfig: true },
  )

  await app.startAllMicroservices()

  if (ENV != Environment.Local) {
    const SENTRY_DSN = configService.get('global.sentryDsn')
    Sentry.init({ dsn: SENTRY_DSN, environment: ENV })
    app.useGlobalInterceptors(new SentryInterceptor())
  }

  logger.debug('===== REWARD: Service event-dispatcher started =====')
}
bootstrap()
