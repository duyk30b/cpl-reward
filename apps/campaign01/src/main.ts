import { NestFactory } from '@nestjs/core'
import { Campaign01Module } from './campaign01.module'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    Campaign01Module,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:29092'],
        },
      },
    },
  )

  app.listen()
}
bootstrap()
