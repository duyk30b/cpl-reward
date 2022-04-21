import { NestFactory } from '@nestjs/core'
import { MissionsModule } from './missions.module'
import { ConfigService } from '@nestjs/config'
import { KafkaDecoratorProcessorService } from '@lib/kafka'
import { Environment, LogLevel } from '@lib/common'
import { KafkaOptions, Transport } from '@nestjs/microservices'
import { MissionsController } from './missions.controller'
import { SentryInterceptor } from '@lib/common/interceptors/sentry.interceptor'
import * as Sentry from '@sentry/node'

async function bootstrap() {
  const app = await NestFactory.create(MissionsModule, {
    logger:
      process.env.ENV == Environment.Production
        ? [LogLevel.Error, LogLevel.Warn]
        : Object.values(LogLevel),
  })

  const configService: ConfigService = app.get(ConfigService)
  app
    .get(KafkaDecoratorProcessorService)
    .processKafkaDecorators([MissionsController])
  app.connectMicroservice<KafkaOptions>({
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
  })

  await app.startAllMicroservices()

  const port: number = configService.get<number>('common.campaigns_port')

  // Sentry
  const SENTRY_DSN = configService.get('common.sentry_dsn')
  Sentry.init({ dsn: SENTRY_DSN })
  app.useGlobalInterceptors(new SentryInterceptor())

  await app.listen(port)

  process.on('exit', async () => {
    await app.close()
    process.exit(1)
  })
}
bootstrap()
