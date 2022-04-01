import { Controller, Logger } from '@nestjs/common'
import { KafkaMessage, KafkaTopic } from '@lib/kafka'
import { Payload } from '@nestjs/microservices'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { EVENTS } from '@lib/mission'

@Controller()
export class MissionsController {
  private readonly logger = new Logger(MissionsController.name)

  constructor(private eventEmitter: EventEmitter2) {}

  emitEvent(msgId: string, msgName: string, eventData: any) {
    // Data length
    if (Object.keys(eventData).length == 0) {
      this.eventEmitter.emit('write_log', {
        logLevel: 'error',
        traceCode: 'm03',
        data: {
          msgData: eventData,
          missionId: null,
          campaignId: null,
          msgName: msgName,
          msgId: msgId,
        },
      })
      return
    }

    // user_id field
    if (!eventData.user_id) {
      this.logger.error(
        `[EVENT ${EVENTS[msgName]}] Missing user_id fields. Stop!`,
      )
      return
    }

    // Push kafka event to internal event
    this.logger.log(
      `[EVENT ${
        EVENTS[msgName]
      }] Received event. Message value: ${JSON.stringify(eventData)}`,
    )

    this.eventEmitter.emit('received_kafka_event', {
      msgId: '123',
      msgName: msgName,
      msgData: eventData,
    })
  }
  /**
   * KAFKA AUTH EVENT AREA
   */
  @KafkaTopic('kafka.auth_user_login')
  async authUserLogin(@Payload() message: KafkaMessage) {
    this.emitEvent('AUTH_USER_LOGIN', message.key, message.value.data ?? {})
  }

  @KafkaTopic('kafka.auth_user_change_email')
  async authUserChangeEmail(@Payload() message: KafkaMessage) {
    this.emitEvent(
      'AUTH_USER_CHANGE_EMAIL',
      message.key,
      message.value.data ?? {},
    )
  }

  @KafkaTopic('kafka.auth_user_created')
  async authUserCreated(@Payload() message: KafkaMessage) {
    // Transform data
    let data = {} as any
    if (message.value.data) {
      data = message.value.data
      data.user_id = data.id
    }
    this.emitEvent('AUTH_USER_CREATED', message.key, data)
  }

  @KafkaTopic('kafka.auth_user_logout')
  async authUserLogout(@Payload() message: KafkaMessage) {
    this.emitEvent('AUTH_USER_LOGOUT', message.key, message.value.data ?? {})
  }

  @KafkaTopic('kafka.auth_user_change_password')
  async authUserChangePassword(@Payload() message: KafkaMessage) {
    this.emitEvent(
      'AUTH_USER_CHANGE_PASSWORD',
      message.key,
      message.value.data ?? {},
    )
  }

  @KafkaTopic('kafka.auth_user_change_info')
  async authUserChangeInfo(@Payload() message: KafkaMessage) {
    this.emitEvent(
      'AUTH_USER_CHANGE_INFO',
      message.key,
      message.value.data ?? {},
    )
  }

  @KafkaTopic('kafka.auth_user_authenticator_status_updated')
  async authUserAuthenticatorStatusUpdated(@Payload() message: KafkaMessage) {
    this.emitEvent(
      'AUTH_USER_AUTHENTICATOR_STATUS_UPDATED',
      message.key,
      message.value.data ?? {},
    )
  }

  @KafkaTopic('kafka.auth_user_kyc_status_updated')
  async authUserKycStatusStatusUpdated(@Payload() message: KafkaMessage) {
    this.emitEvent(
      'AUTH_USER_KYC_STATUS_UPDATED',
      message.key,
      message.value.data ?? {},
    )
  }

  @KafkaTopic('kafka.auth_user_kyc_registered')
  async authUserKycRegistered(@Payload() message: KafkaMessage) {
    this.emitEvent(
      'AUTH_USER_KYC_REGISTERED',
      message.key,
      message.value.data ?? {},
    )
  }

  @KafkaTopic('kafka.auth_user_kyc_auto_kyc_finished')
  async authUserKycAutoKycFinished(@Payload() message: KafkaMessage) {
    this.emitEvent(
      'AUTH_USER_KYC_AUTO_KYC_FINISHED',
      message.key,
      message.value.data ?? {},
    )
  }

  @KafkaTopic('kafka.auth_user_change_lv')
  async authUserChangeLv(@Payload() message: KafkaMessage) {
    this.emitEvent('AUTH_USER_CHANGE_LV', message.key, message.value.data ?? {})
  }

  /**
   * KAFKA BCE EVENT AREA
   */
  @KafkaTopic('kafka.bce_deposit')
  async bceDeposit(@Payload() message: KafkaMessage) {
    this.emitEvent('BCE_DEPOSIT', message.key, message.value)
  }

  @KafkaTopic('kafka.bce_withdraw')
  async bceWithdraw(@Payload() message: KafkaMessage) {
    this.emitEvent('BCE_WITHDRAW', message.key, message.value)
  }

  @KafkaTopic('kafka.bce_trading_matched')
  async bceTradingMatched(@Payload() message: KafkaMessage) {
    this.emitEvent('BCE_TRADING_MATCHED', message.key, message.value)
  }

  /**
   * KAFKA BO EVENT AREA
   */
  @KafkaTopic('kafka.high_low_transfer_balance')
  async highLowTransferBalance(@Payload() message: KafkaMessage) {
    this.emitEvent('HIGH_LOW_TRANSFER_BALANCE', message.key, message.value)
  }
  @KafkaTopic('kafka.high_low_create')
  async highLowCreate(@Payload() message: KafkaMessage) {
    this.emitEvent('HIGH_LOW_CREATE', message.key, message.value)
  }

  @KafkaTopic('kafka.high_low_win')
  async highLowWin(@Payload() message: KafkaMessage) {
    this.emitEvent('HIGH_LOW_WIN', message.key, message.value)
  }

  @KafkaTopic('kafka.high_low_lost')
  async highLowLost(@Payload() message: KafkaMessage) {
    this.emitEvent('HIGH_LOW_LOST', message.key, message.value)
  }

  @KafkaTopic('kafka.high_low_cancel')
  async highLowCancel(@Payload() message: KafkaMessage) {
    this.emitEvent('HIGH_LOW_CANCEL', message.key, message.value)
  }
}
