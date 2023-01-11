import { EBceEvent, KafkaTopic } from '@libs/kafka-libs'
import { Controller } from '@nestjs/common'
import { Payload } from '@nestjs/microservices'
import { BceConsumerService } from './bce-consumer.service'

@Controller()
export class BceConsumerController {
  constructor(private readonly bceConsumerService: BceConsumerService) {}

  @KafkaTopic(EBceEvent.DEPOSIT)
  async handleDeposit(@Payload('value') message: any) {
    console.log('🚀 ~ file:  ~ handleDeposit ~ message', message)
    this.bceConsumerService.handleBceMessageResult(message, '')
  }

  @KafkaTopic(EBceEvent.TRADING_MATCHED)
  async handleTradingMatched(@Payload('value') message: any) {
    console.log('🚀 ~ file:  ~ handleTradingMatched ~ message', message)
    this.bceConsumerService.handleBceMessageResult(message, '')
  }

  @KafkaTopic(EBceEvent.WITHDRAW)
  async handleWithdraw(@Payload('value') message: any) {
    console.log('🚀 ~ file:  ~ handleWithdraw ~ message', message)
    this.bceConsumerService.handleBceMessageResult(message, '')
  }
}
