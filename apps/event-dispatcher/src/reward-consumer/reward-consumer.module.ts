import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { RewardConsumerController } from './reward-consumer.controller'
import { RewardConsumerService } from './reward-consumer.service'

@Module({
  imports: [ConfigModule],
  controllers: [RewardConsumerController],
  providers: [RewardConsumerService],
})
export class RewardConsumerModule {}
