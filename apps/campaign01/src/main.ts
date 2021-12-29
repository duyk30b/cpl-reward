import { NestFactory } from '@nestjs/core'
import { Campaign01Module } from './campaign01.module'

async function bootstrap() {
  const app = await NestFactory.create(Campaign01Module)
  await app.listen(3000)
}
bootstrap()
