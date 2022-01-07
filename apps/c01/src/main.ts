import { NestFactory } from '@nestjs/core'
import { C01Module } from './c01.module'
import { ConfigService } from '@nestjs/config'
import { KafkaDecoratorProcessorService } from '@app/kafka'
import { Environment, LogLevel } from '@app/common'
import { KafkaOptions, Transport } from '@nestjs/microservices'
import { C01Controller } from './c01.controller'

async function bootstrap() {
  const app = await NestFactory.create(C01Module, {
    logger:
      process.env.APP_ENV == Environment.Production
        ? [LogLevel.Error, LogLevel.Warn]
        : Object.values(LogLevel),
  })

  app
    .get(KafkaDecoratorProcessorService)
    .processKafkaDecorators([C01Controller])

  const configService: ConfigService = app.get(ConfigService)

  app.connectMicroservice<KafkaOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [configService.get<string>('kafka.uri')],
      },
      consumer: {
        groupId: configService.get<string>('consumer_c01'),
        allowAutoTopicCreation: true,
      },
    },
  })

  await app.startAllMicroservices()

  const port: number = configService.get<number>('common.c01_port')

  await app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Campaign 01 is running in port ${port}`)
  })
}
bootstrap()
