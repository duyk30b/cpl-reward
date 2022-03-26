import { Controller, Logger } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { KafkaMessage, KafkaTopic } from '@lib/kafka'
import { Payload } from '@nestjs/microservices'
import { EVENTS } from '@lib/mission'

@Controller()
export class AuthMissionsController {
  private readonly logger = new Logger(AuthMissionsController.name)

  constructor(private eventEmitter: EventEmitter2) {}

  @KafkaTopic('kafka.auth_user_login')
  async authUserLogin(@Payload() message: KafkaMessage) {
    const eventName = 'AUTH_USER_LOGIN'
    const value = message.value
    if (value.data.user_id === undefined) {
      this.logger.error(
        `[EVENT ${EVENTS[eventName]}] Wrong message struct: ${JSON.stringify(
          value,
        )}`,
      )
      return
    }

    this.eventEmitter.emit('get_events_by_name', {
      messageValueData: message.value.data,
      eventName,
    })
  }

  @KafkaTopic('kafka.auth_user_change_email')
  async authUserChangeEmail(@Payload() message: KafkaMessage) {
    const eventName = 'AUTH_USER_CHANGE_EMAIL'
    const value = message.value
    if (value.data.user_id === undefined) {
      this.logger.error(
        `[EVENT ${EVENTS[eventName]}] Wrong message struct: ${JSON.stringify(
          value,
        )}`,
      )
      return
    }

    this.eventEmitter.emit('get_events_by_name', {
      messageValueData: message.value.data,
      eventName,
    })
  }
}
