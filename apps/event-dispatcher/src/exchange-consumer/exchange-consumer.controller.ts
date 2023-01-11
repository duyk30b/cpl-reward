import { EExchangeEvent, KafkaTopic } from '@libs/kafka-libs'
import { Controller } from '@nestjs/common'
import { Payload } from '@nestjs/microservices'
import { ExchangeConsumerService } from './exchange-consumer.service'

@Controller()
export class ExchangeConsumerController {
  constructor(
    private readonly exchangeConsumerService: ExchangeConsumerService,
  ) {}

  @KafkaTopic(EExchangeEvent.CONFIRM_ORDER_MATCH)
  async handleConfirmOrderMatch(@Payload('value') message: any) {
    console.log('🚀 ~~ handleConfirmOrderMatch ~ message', message)
    this.exchangeConsumerService.handleExchangeMessageResult(message, '')
  }
}
