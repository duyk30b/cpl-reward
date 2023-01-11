import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { HighLowConsumerController } from './high-low-consumer.controller'
import { HighLowConsumerService } from './high-low-consumer.service'

@Module({
  imports: [ConfigModule],
  controllers: [HighLowConsumerController],
  providers: [HighLowConsumerService],
})
export class HighLowConsumerModule {}
