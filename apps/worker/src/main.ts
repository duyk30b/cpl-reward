import { Environment, LogLevel } from '@lib/common'
import { SentryInterceptor } from '@lib/common/interceptors/sentry.interceptor'
import { KafkaDecoratorProcessorService } from '@lib/kafka'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { KafkaOptions, Transport } from '@nestjs/microservices'
import * as Sentry from '@sentry/node'
import { WorkerController } from './worker.controller'
import { WorkerModule } from './worker.module'

async function bootstrap() {
  const logger = new Logger('bootstrap')
  const app = await NestFactory.create(WorkerModule, {
    logger:
      process.env.ENV == Environment.Production
        ? [LogLevel.Error, LogLevel.Warn]
        : Object.values(LogLevel),
  })

  const configService: ConfigService = app.get(ConfigService)
  app
    .get(KafkaDecoratorProcessorService)
    .processKafkaDecorators([WorkerController])

  app.connectMicroservice<KafkaOptions>(
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: configService.get<string>('kafka.client'),
          brokers: [configService.get<string>('kafka.uri')],
        },
        consumer: {
          groupId: configService.get<string>('kafka.consumer'),
          allowAutoTopicCreation: true,
        },
      },
    },
    {
      inheritAppConfig: true,
    },
  )

  await app.startAllMicroservices()

  const port: number = configService.get<number>('common.campaigns_port')

  // Sentry
  const SENTRY_DSN = configService.get('common.sentry_dsn')
  Sentry.init({ dsn: SENTRY_DSN })
  app.useGlobalInterceptors(new SentryInterceptor())

  await app.listen(port, () => {
    logger.debug('===== REWARD: Service worker started =====')
  })

  process.on('exit', async () => {
    await app.close()
    process.exit(1)
  })
}

bootstrap()
