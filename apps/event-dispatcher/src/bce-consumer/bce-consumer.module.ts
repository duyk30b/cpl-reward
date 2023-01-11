import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { BceConsumerController } from './bce-consumer.controller'
import { BceConsumerService } from './bce-consumer.service'

@Module({
  imports: [ConfigModule],
  controllers: [BceConsumerController],
  providers: [BceConsumerService],
})
export class BceConsumerModule {}
