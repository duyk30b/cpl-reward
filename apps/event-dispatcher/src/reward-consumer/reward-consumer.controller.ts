import { ERewardEvent, KafkaTopic } from '@libs/kafka-libs'
import { Controller } from '@nestjs/common'
import { Payload } from '@nestjs/microservices'
import { RewardConsumerService } from './reward-consumer.service'

@Controller()
export class RewardConsumerController {
  constructor(
    private readonly exchangeConsumerService: RewardConsumerService,
  ) {}

  @KafkaTopic(ERewardEvent.USER_CHECK_IN)
  async handleUserCheckIn(@Payload('value') message: any) {
    console.log('🚀 ~  ~ handleUserCheckIn ~ message', message)
    this.exchangeConsumerService.handleRewardMessageResult(message, '')
  }
}
