import { Controller, Logger } from '@nestjs/common'
import { KafkaMessage, KafkaTopic } from '@lib/kafka'
import { Payload } from '@nestjs/microservices'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { EVENTS } from '@lib/mission'

@Controller()
export class MissionsController {
  private readonly logger = new Logger(MissionsController.name)

  constructor(private eventEmitter: EventEmitter2) {}

  emitEvent(eventName: string, eventData: any) {
    if (Object.keys(eventData).length == 0) {
      this.logger.log(
        `[EVENT ${EVENTS[eventName]}] Wrong message struct: ${JSON.stringify(
          eventData,
        )}`,
      )
      return
    }

    this.logger.log(
      `[EVENT ${
        EVENTS[eventName]
      }] Received event. Message value: ${JSON.stringify(eventData)}`,
    )

    this.eventEmitter.emit('get_events_by_name', {
      messageValueData: eventData,
      eventName,
    })
  }
  /**
   * KAFKA AUTH EVENT AREA
   */
  @KafkaTopic('kafka.auth_user_login')
  async authUserLogin(@Payload() message: KafkaMessage) {
    this.emitEvent('AUTH_USER_LOGIN', message.value.data ?? {})
  }

  @KafkaTopic('kafka.auth_user_change_email')
  async authUserChangeEmail(@Payload() message: KafkaMessage) {
    this.emitEvent('AUTH_USER_CHANGE_EMAIL', message.value.data ?? {})
  }

  @KafkaTopic('kafka.auth_user_created')
  async authUserCreated(@Payload() message: KafkaMessage) {
    this.emitEvent('AUTH_USER_CREATED', message.value.data ?? {})
  }

  @KafkaTopic('kafka.auth_user_logout')
  async authUserLogout(@Payload() message: KafkaMessage) {
    this.emitEvent('AUTH_USER_LOGOUT', message.value.data ?? {})
  }

  @KafkaTopic('kafka.auth_user_change_password')
  async authUserChangePassword(@Payload() message: KafkaMessage) {
    this.emitEvent('AUTH_USER_CHANGE_PASSWORD', message.value.data ?? {})
  }

  @KafkaTopic('kafka.auth_user_change_info')
  async authUserChangeInfo(@Payload() message: KafkaMessage) {
    this.emitEvent('AUTH_USER_CHANGE_INFO', message.value.data ?? {})
  }

  @KafkaTopic('kafka.auth_user_authenticator_status_updated')
  async authUserAuthenticatorStatusUpdated(@Payload() message: KafkaMessage) {
    this.emitEvent(
      'AUTH_USER_AUTHENTICATOR_STATUS_UPDATED',
      message.value.data ?? {},
    )
  }

  @KafkaTopic('kafka.auth_user_kyc_status_updated')
  async authUserKycStatusStatusUpdated(@Payload() message: KafkaMessage) {
    this.emitEvent('AUTH_USER_KYC_STATUS_UPDATED', message.value.data ?? {})
  }

  @KafkaTopic('kafka.auth_user_kyc_registered')
  async authUserKycRegistered(@Payload() message: KafkaMessage) {
    this.emitEvent('AUTH_USER_KYC_REGISTERED', message.value.data ?? {})
  }

  @KafkaTopic('kafka.auth_user_kyc_auto_kyc_finished')
  async authUserKycAutoKycFinished(@Payload() message: KafkaMessage) {
    this.emitEvent('AUTH_USER_KYC_AUTO_KYC_FINISHED', message.value.data ?? {})
  }

  @KafkaTopic('kafka.auth_user_change_lv')
  async authUserChangeLv(@Payload() message: KafkaMessage) {
    this.emitEvent('AUTH_USER_CHANGE_LV', message.value.data ?? {})
  }

  /**
   * KAFKA BCE EVENT AREA
   */
  @KafkaTopic('kafka.bce_deposit')
  async bceDeposit(@Payload() message: KafkaMessage) {
    this.emitEvent('BCE_DEPOSIT', message.value)
  }

  @KafkaTopic('kafka.bce_withdraw')
  async bceWithdraw(@Payload() message: KafkaMessage) {
    this.emitEvent('BCE_WITHDRAW', message.value)
  }

  @KafkaTopic('kafka.bce_trading_matched')
  async bceTradingMatched(@Payload() message: KafkaMessage) {
    this.emitEvent('BCE_TRADING_MATCHED', message.value)
  }

  /**
   * KAFKA BO EVENT AREA
   */
  @KafkaTopic('kafka.high_low_transfer_balance')
  async highLowTransferBalance(@Payload() message: KafkaMessage) {
    this.emitEvent('HIGH_LOW_TRANSFER_BALANCE', message.value)
  }
  @KafkaTopic('kafka.high_low_create')
  async highLowCreate(@Payload() message: KafkaMessage) {
    this.emitEvent('HIGH_LOW_CREATE', message.value)
  }

  @KafkaTopic('kafka.high_low_win')
  async highLowWin(@Payload() message: KafkaMessage) {
    this.emitEvent('HIGH_LOW_WIN', message.value)
  }

  @KafkaTopic('kafka.high_low_lost')
  async highLowLost(@Payload() message: KafkaMessage) {
    this.emitEvent('HIGH_LOW_LOST', message.value)
  }

  @KafkaTopic('kafka.high_low_cancel')
  async highLowCancel(@Payload() message: KafkaMessage) {
    this.emitEvent('HIGH_LOW_CANCEL', message.value)
  }
}
