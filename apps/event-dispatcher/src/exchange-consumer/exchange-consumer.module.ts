import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ExchangeConsumerController } from './exchange-consumer.controller'
import { ExchangeConsumerService } from './exchange-consumer.service'

@Module({
  imports: [ConfigModule],
  controllers: [ExchangeConsumerController],
  providers: [ExchangeConsumerService],
})
export class ExchangeConsumerModule {}
