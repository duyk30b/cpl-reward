import { NestFactory } from '@nestjs/core'
import { Campaign02Module } from './campaign02.module'
import { MicroserviceOptions } from '@nestjs/microservices'
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    Campaign02Module,
  )
  app.listen()
}
bootstrap()
