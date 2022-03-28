import { Controller, Logger } from '@nestjs/common'
import { KafkaMessage, KafkaTopic } from '@lib/kafka'
import { Payload } from '@nestjs/microservices'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { EVENTS } from '@lib/mission'

@Controller()
export class MissionsController {
  private readonly logger = new Logger(MissionsController.name)

  constructor(private eventEmitter: EventEmitter2) {}

  /**
   * KAFKA AUTH EVENT AREA
   */
  @KafkaTopic('kafka.auth_user_login')
  async authUserLogin(@Payload() message: KafkaMessage) {
    const eventName = 'AUTH_USER_LOGIN'
    const value = message.value
    if (Object.keys(value.data).length > 0) {
      this.logger.log(
        `[EVENT ${EVENTS[eventName]}] Wrong message struct: ${JSON.stringify(
          value,
        )}`,
      )
      return
    }

    this.logger.log(
      `[EVENT ${
        EVENTS[eventName]
      }] Receive event. Message value: ${JSON.stringify(value)}`,
    )
    this.eventEmitter.emit('get_events_by_name', {
      messageValueData: value.data,
      eventName,
    })
  }

  @KafkaTopic('kafka.auth_user_change_email')
  async authUserChangeEmail(@Payload() message: KafkaMessage) {
    const eventName = 'AUTH_USER_CHANGE_EMAIL'
    const value = message.value
    if (Object.keys(value.data).length > 0) {
      this.logger.log(
        `[EVENT ${EVENTS[eventName]}] Wrong message struct: ${JSON.stringify(
          value,
        )}`,
      )
      return
    }

    this.logger.log(
      `[EVENT ${
        EVENTS[eventName]
      }] Receive event. Message value: ${JSON.stringify(value)}`,
    )
    this.eventEmitter.emit('get_events_by_name', {
      messageValueData: value.data,
      eventName,
    })
  }

  @KafkaTopic('kafka.auth_user_created')
  async authUserCreated(@Payload() message: KafkaMessage) {
    const eventName = 'AUTH_USER_CREATED'
    const value = message.value
    if (Object.keys(value.data).length > 0) {
      this.logger.log(
        `[EVENT ${EVENTS[eventName]}] Wrong message struct: ${JSON.stringify(
          value,
        )}`,
      )
      return
    }

    this.logger.log(
      `[EVENT ${
        EVENTS[eventName]
      }] Receive event. Message value: ${JSON.stringify(value)}`,
    )
    this.eventEmitter.emit('get_events_by_name', {
      messageValueData: value.data,
      eventName,
    })
  }

  @KafkaTopic('kafka.auth_user_logout')
  async authUserLogout(@Payload() message: KafkaMessage) {
    const eventName = 'AUTH_USER_LOGOUT'
    const value = message.value
    if (Object.keys(value.data).length > 0) {
      this.logger.log(
        `[EVENT ${EVENTS[eventName]}] Wrong message struct: ${JSON.stringify(
          value,
        )}`,
      )
      return
    }

    this.logger.log(
      `[EVENT ${
        EVENTS[eventName]
      }] Receive event. Message value: ${JSON.stringify(value)}`,
    )
    this.eventEmitter.emit('get_events_by_name', {
      messageValueData: value.data,
      eventName,
    })
  }

  @KafkaTopic('kafka.auth_user_change_password')
  async authUserChangePassword(@Payload() message: KafkaMessage) {
    const eventName = 'AUTH_USER_CHANGE_PASSWORD'
    const value = message.value
    if (Object.keys(value.data).length > 0) {
      this.logger.log(
        `[EVENT ${EVENTS[eventName]}] Wrong message struct: ${JSON.stringify(
          value,
        )}`,
      )
      return
    }

    this.logger.log(
      `[EVENT ${
        EVENTS[eventName]
      }] Receive event. Message value: ${JSON.stringify(value)}`,
    )
    this.eventEmitter.emit('get_events_by_name', {
      messageValueData: value.data,
      eventName,
    })
  }

  @KafkaTopic('kafka.auth_user_authenticator_status_updated')
  async authUserAuthenticatorStatusUpdated(@Payload() message: KafkaMessage) {
    const eventName = 'AUTH_USER_AUTHENTICATOR_STATUS_UPDATED'
    const value = message.value
    if (Object.keys(value.data).length > 0) {
      this.logger.log(
        `[EVENT ${EVENTS[eventName]}] Wrong message struct: ${JSON.stringify(
          value,
        )}`,
      )
      return
    }

    this.logger.log(
      `[EVENT ${
        EVENTS[eventName]
      }] Receive event. Message value: ${JSON.stringify(value)}`,
    )
    this.eventEmitter.emit('get_events_by_name', {
      messageValueData: value.data,
      eventName,
    })
  }

  /**
   * KAFKA BCE EVENT AREA
   */
  @KafkaTopic('kafka.bce_deposit')
  async bceDeposit(@Payload() message: KafkaMessage) {
    const eventName = 'BCE_DEPOSIT'
    const value = message.value
    if (Object.keys(value).length > 0) {
      this.logger.log(
        `[EVENT ${EVENTS[eventName]}] Wrong message struct: ${JSON.stringify(
          value,
        )}`,
      )
      return
    }

    this.logger.log(
      `[EVENT ${
        EVENTS[eventName]
      }] Receive event. Message value: ${JSON.stringify(value)}`,
    )
    this.eventEmitter.emit('get_events_by_name', {
      messageValueData: value,
      eventName,
    })
  }

  @KafkaTopic('kafka.bce_withdraw')
  async bceWithdraw(@Payload() message: KafkaMessage) {
    const eventName = 'BCE_WITHDRAW'
    const value = message.value
    if (Object.keys(value).length > 0) {
      this.logger.log(
        `[EVENT ${EVENTS[eventName]}] Wrong message struct: ${JSON.stringify(
          value,
        )}`,
      )
      return
    }

    this.logger.log(
      `[EVENT ${
        EVENTS[eventName]
      }] Receive event. Message value: ${JSON.stringify(value)}`,
    )
    this.eventEmitter.emit('get_events_by_name', {
      messageValueData: value,
      eventName,
    })
  }

  /**
   * KAFKA BO EVENT AREA
   */
  @KafkaTopic('kafka.high_low_create')
  async highLowCreate(@Payload() message: KafkaMessage) {
    const eventName = 'HIGH_LOW_CREATE'
    const value = message.value
    if (Object.keys(value).length > 0) {
      this.logger.log(
        `[EVENT ${EVENTS[eventName]}] Wrong message struct: ${JSON.stringify(
          value,
        )}`,
      )
      return
    }

    this.logger.log(
      `[EVENT ${
        EVENTS[eventName]
      }] Receive event. Message value: ${JSON.stringify(value)}`,
    )
    this.eventEmitter.emit('get_events_by_name', {
      messageValueData: value,
      eventName,
    })
  }

  @KafkaTopic('kafka.high_low_win')
  async highLowWin(@Payload() message: KafkaMessage) {
    const eventName = 'HIGH_LOW_WIN'
    const value = message.value
    if (Object.keys(value).length > 0) {
      this.logger.log(
        `[EVENT ${EVENTS[eventName]}] Wrong message struct: ${JSON.stringify(
          value,
        )}`,
      )
      return
    }

    this.logger.log(
      `[EVENT ${
        EVENTS[eventName]
      }] Receive event. Message value: ${JSON.stringify(value)}`,
    )
    this.eventEmitter.emit('get_events_by_name', {
      messageValueData: value,
      eventName,
    })
  }

  @KafkaTopic('kafka.high_low_lost')
  async highLowLost(@Payload() message: KafkaMessage) {
    const eventName = 'HIGH_LOW_LOST'
    const value = message.value
    if (Object.keys(value).length > 0) {
      this.logger.log(
        `[EVENT ${EVENTS[eventName]}] Wrong message struct: ${JSON.stringify(
          value,
        )}`,
      )
      return
    }

    this.logger.log(
      `[EVENT ${
        EVENTS[eventName]
      }] Receive event. Message value: ${JSON.stringify(value)}`,
    )
    this.eventEmitter.emit('get_events_by_name', {
      messageValueData: value,
      eventName,
    })
  }

  @KafkaTopic('kafka.high_low_cancel')
  async highLowCancel(@Payload() message: KafkaMessage) {
    const eventName = 'HIGH_LOW_CANCEL'
    const value = message.value
    if (Object.keys(value).length > 0) {
      this.logger.log(
        `[EVENT ${EVENTS[eventName]}] Wrong message struct: ${JSON.stringify(
          value,
        )}`,
      )
      return
    }

    this.logger.log(
      `[EVENT ${
        EVENTS[eventName]
      }] Receive event. Message value: ${JSON.stringify(value)}`,
    )
    this.eventEmitter.emit('get_events_by_name', {
      messageValueData: value,
      eventName,
    })
  }
}
