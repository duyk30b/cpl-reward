import { NestFactory } from '@nestjs/core';
import { Campaigns/camp01Module } from './campaigns/camp01.module';

async function bootstrap() {
  const app = await NestFactory.create(Campaigns/camp01Module);
  await app.listen(3000);
}
bootstrap();
