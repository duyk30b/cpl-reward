import { Controller, Logger } from '@nestjs/common'
import { KafkaMessage, KafkaTopic } from '@app/kafka'
import { Payload } from '@nestjs/microservices'
import { plainToInstance } from 'class-transformer'
import { HlUserSpendMoneyDto } from '@app/kafka/dto/hl-user-spend-money.dto'
import { validate } from 'class-validator'

@Controller()
export class CampaignsController {
  private readonly logger = new Logger(CampaignsController.name)

  @KafkaTopic('kafka.hl_user_spend_money')
  async createOrder(@Payload() message: KafkaMessage): Promise<void> {
    // Transform message
    message.value = plainToInstance(HlUserSpendMoneyDto, message.value, {
      enableImplicitConversion: true,
    })
    if (!(await validate(message.value))) {
      this.logger.warn(
        'Wrong hl_user_spend_money message struct: ' +
          JSON.stringify(message.value),
      )
      return
    }

    // TODO: Emit event
  }
}
