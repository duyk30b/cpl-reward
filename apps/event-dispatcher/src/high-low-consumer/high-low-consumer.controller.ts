import { EHightLowEvent, KafkaTopic, MessageId } from '@libs/kafka-libs'
import { Controller } from '@nestjs/common'
import { Payload } from '@nestjs/microservices'
import { HighLowMessageDto } from './high-low-consumer.dto'
import { HighLowConsumerService } from './high-low-consumer.service'

@Controller()
export class HighLowConsumerController {
  constructor(
    private readonly highLowConsumerService: HighLowConsumerService,
  ) {}

  @KafkaTopic(EHightLowEvent.WIN)
  async handleHighLowWin(
    @Payload('value') message: HighLowMessageDto,
    @MessageId() messageId: string,
  ) {
    console.log('🚀 ~ file:  HighLowConsumerController ~ messageId', messageId)
    console.log('🚀 ~ ~ handleHighLowWin ~ message', message)
    await this.highLowConsumerService.handleHighLowResult(message, 'Win')
  }

  @KafkaTopic(EHightLowEvent.LOSE)
  async handleHighLowLose(@Payload('value') message: any) {
    console.log('🚀 ~ ~ handleHighLowLose ~ message', message)
    await this.highLowConsumerService.handleHighLowResult(message, 'Lose')
  }

  @KafkaTopic(EHightLowEvent.CANCEL)
  async handleHighLowCancel(@Payload('value') message: any) {
    console.log('🚀 ~ ~ handleHighLowCancel ~ message', message)
    await this.highLowConsumerService.handleHighLowResult(message, 'Cancel')
  }

  @KafkaTopic(EHightLowEvent.CREATE)
  async handleHighLowCreate(@Payload('value') message: any) {
    console.log('🚀 ~ ~ handleHighLowCreate ~ message', message)
    await this.highLowConsumerService.handleHighLowResult(message, 'Create')
  }

  @KafkaTopic(EHightLowEvent.TRANSFER_BALANCE)
  async handleHighLowTransferBalance(@Payload('value') message: any) {
    console.log('🚀 ~ ~ handleHighLowTransferBalance ~ message', message)
    await this.highLowConsumerService.handleHighLowResult(message, 'Balance')
  }
}
