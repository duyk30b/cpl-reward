import { NestFactory } from '@nestjs/core'
import { CampaignsModule } from './campaigns.module'
import { ConfigService } from '@nestjs/config'
import { KafkaDecoratorProcessorService } from '@app/kafka'
import { Environment, LogLevel } from '@app/common'
import { KafkaOptions, Transport } from '@nestjs/microservices'
import { CampaignsController } from './campaigns.controller'
import { SentryInterceptor } from '@app/common/interceptors/sentry.interceptor'
import * as Sentry from '@sentry/node'

async function bootstrap() {
  const app = await NestFactory.create(CampaignsModule, {
    logger:
      process.env.ENV == Environment.Production
        ? [LogLevel.Error, LogLevel.Warn]
        : Object.values(LogLevel),
  })

  app
    .get(KafkaDecoratorProcessorService)
    .processKafkaDecorators([CampaignsController])

  const configService: ConfigService = app.get(ConfigService)

  app.connectMicroservice<KafkaOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [configService.get<string>('kafka.uri')],
      },
      consumer: {
        groupId: configService.get<string>('kafka.campaigns_group_id'),
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

  await app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Campaigns is running in port ${port}`)
  })
}
bootstrap()
