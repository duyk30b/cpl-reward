import { Controller, Logger } from '@nestjs/common'
import { KafkaMessage, KafkaTopic } from '@app/kafka'
import { Payload } from '@nestjs/microservices'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { HlUserSpendMoney } from '@app/common/interfaces/hl-user-spend-money'

@Controller()
export class MissionsController {
  private readonly logger = new Logger(MissionsController.name)

  constructor(private eventEmitter: EventEmitter2) {}

  @KafkaTopic('kafka.hl_user_spend_money')
  async createOrder(@Payload() message: KafkaMessage): Promise<void> {
    // Transform message
    const hlUserSpendMoney = plainToInstance(HlUserSpendMoney, message.value, {
      enableImplicitConversion: true,
    })
    if (!(await validate(hlUserSpendMoney))) {
      this.logger.warn(
        'Wrong hl_user_spend_money message struct: ' +
          JSON.stringify(hlUserSpendMoney),
      )
      return
    }

    this.eventEmitter.emit('hl_user_spend_money', hlUserSpendMoney)
  }
}
