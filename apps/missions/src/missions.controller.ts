import { Controller, Logger } from '@nestjs/common'
import { KafkaMessage, KafkaTopic } from '@lib/kafka'
import { Payload } from '@nestjs/microservices'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ExternalUserService } from '@lib/external-user'

@Controller()
export class MissionsController {
  private readonly logger = new Logger(MissionsController.name)

  constructor(
    private eventEmitter: EventEmitter2,
    private externalUserService: ExternalUserService,
  ) {}

  @KafkaTopic('kafka.auth_user_login')
  async authUserLogin(@Payload() message: KafkaMessage) {
    if (message.value.user_id === undefined) {
      this.logger.error(
        'Wrong auth_user_login message struct: ' +
          JSON.stringify(message.value),
      )
      return
    }
    this.logger.log(
      '[STEP 1] auth_user_login message struct' + JSON.stringify(message.value),
    )
    const user = await this.externalUserService.getUserInfo(
      message.value.user_id,
    )
    if (user === null) {
      this.logger.error('Wrong user info: ' + JSON.stringify(user))
      return
    }
    this.eventEmitter.emit('auth_user_login', { id: message.value.user_id })
  }
}
