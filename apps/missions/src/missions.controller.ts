import { Controller } from '@nestjs/common'
import { MessageId, KafkaMessage, KafkaTopic } from '@lib/kafka'
import { Payload } from '@nestjs/microservices'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { MissionsService } from './missions.service'

@Controller()
export class MissionsController {
  eventEmit = 'write_log'

  constructor(
    private eventEmitter: EventEmitter2,
    private missionsService: MissionsService,
  ) {}

  emitEvent(msgName: string, msgId: string | null, msgData: any) {
    // transform first class object and timestamp
    if (Object.keys(msgData).length > 0) {
      msgData = this.missionsService.transformEventData(msgData, msgName)
    }

    // Data length
    if (Object.keys(msgData).length == 0) {
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'error',
        traceCode: 'm002',
        data: {
          msgData,
          msgName,
          msgId,
        },
      })
      return
    }

    // user_id field
    if (!msgData.user_id) {
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'error',
        traceCode: 'Missing user_id fields. Stop!',
        data: {
          msgData,
          msgName,
          msgId,
        },
      })
      return
    }

    // Push kafka event to internal event
    this.eventEmitter.emit(this.eventEmit, {
      logLevel: 'log',
      traceCode: 'Received event',
      data: {
        msgData,
        msgName,
        msgId,
      },
    })

    // this.eventEmitter.emit('received_kafka_event', {
    //   msgId,
    //   msgName,
    //   msgData,
    // })
  }

  /**
   * KAFKA AUTH EVENT AREA
   */
  @KafkaTopic('kafka.auth_user_login')
  async authUserLogin(
    @MessageId() messageId: string,
    @Payload() message: KafkaMessage,
  ) {
    this.emitEvent('AUTH_USER_LOGIN', messageId, message.value.data ?? {})
  }

  @KafkaTopic('kafka.auth_user_change_email')
  async authUserChangeEmail(
    @MessageId() messageId: string,
    @Payload() message: KafkaMessage,
  ) {
    this.emitEvent(
      'AUTH_USER_CHANGE_EMAIL',
      messageId,
      message.value.data ?? {},
    )
  }

  @KafkaTopic('kafka.auth_user_created')
  async authUserCreated(
    @MessageId() messageId: string,
    @Payload() message: KafkaMessage,
  ) {
    // Transform data
    let data = {} as any
    if (message.value.data) {
      data = message.value.data
      data.user_id = data.id
    }
    this.emitEvent('AUTH_USER_CREATED', messageId, data)
  }

  @KafkaTopic('kafka.auth_user_logout')
  async authUserLogout(
    @MessageId() messageId: string,
    @Payload() message: KafkaMessage,
  ) {
    this.emitEvent('AUTH_USER_LOGOUT', messageId, message.value.data ?? {})
  }

  @KafkaTopic('kafka.auth_user_change_password')
  async authUserChangePassword(
    @MessageId() messageId: string,
    @Payload() message: KafkaMessage,
  ) {
    this.emitEvent(
      'AUTH_USER_CHANGE_PASSWORD',
      messageId,
      message.value.data ?? {},
    )
  }

  @KafkaTopic('kafka.auth_user_change_info')
  async authUserChangeInfo(
    @MessageId() messageId: string,
    @Payload() message: KafkaMessage,
  ) {
    this.emitEvent('AUTH_USER_CHANGE_INFO', messageId, message.value.data ?? {})
  }

  @KafkaTopic('kafka.auth_user_authenticator_status_updated')
  async authUserAuthenticatorStatusUpdated(
    @MessageId() messageId: string,
    @Payload() message: KafkaMessage,
  ) {
    this.emitEvent(
      'AUTH_USER_AUTHENTICATOR_STATUS_UPDATED',
      messageId,
      message.value.data ?? {},
    )
  }

  @KafkaTopic('kafka.auth_user_kyc_status_updated')
  async authUserKycStatusStatusUpdated(
    @MessageId() messageId: string,
    @Payload() message: KafkaMessage,
  ) {
    this.emitEvent(
      'AUTH_USER_KYC_STATUS_UPDATED',
      messageId,
      message.value.data ?? {},
    )
  }

  @KafkaTopic('kafka.auth_user_kyc_registered')
  async authUserKycRegistered(
    @MessageId() messageId: string,
    @Payload() message: KafkaMessage,
  ) {
    this.emitEvent(
      'AUTH_USER_KYC_REGISTERED',
      messageId,
      message.value.data ?? {},
    )
  }

  @KafkaTopic('kafka.auth_user_kyc_auto_kyc_finished')
  async authUserKycAutoKycFinished(
    @MessageId() messageId: string,
    @Payload() message: KafkaMessage,
  ) {
    this.emitEvent(
      'AUTH_USER_KYC_AUTO_KYC_FINISHED',
      messageId,
      message.value.data ?? {},
    )
  }

  @KafkaTopic('kafka.auth_user_change_lv')
  async authUserChangeLv(
    @MessageId() messageId: string,
    @Payload() message: KafkaMessage,
  ) {
    this.emitEvent('AUTH_USER_CHANGE_LV', messageId, message.value.data ?? {})
  }

  /**
   * KAFKA BCE EVENT AREA
   */
  @KafkaTopic('kafka.bce_deposit')
  async bceDeposit(
    @MessageId() messageId: string,
    @Payload() message: KafkaMessage,
  ) {
    this.emitEvent('BCE_DEPOSIT', messageId, message.value)
  }

  @KafkaTopic('kafka.bce_withdraw')
  async bceWithdraw(
    @MessageId() messageId: string,
    @Payload() message: KafkaMessage,
  ) {
    this.emitEvent('BCE_WITHDRAW', messageId, message.value)
  }

  @KafkaTopic('kafka.bce_trading_matched')
  async bceTradingMatched(
    @MessageId() messageId: string,
    @Payload() message: KafkaMessage,
  ) {
    this.emitEvent('BCE_TRADING_MATCHED', messageId, message.value)
  }

  /**
   * KAFKA BO EVENT AREA
   */
  @KafkaTopic('kafka.high_low_transfer_balance')
  async highLowTransferBalance(
    @MessageId() messageId: string,
    @Payload() message: KafkaMessage,
  ) {
    this.emitEvent('HIGH_LOW_TRANSFER_BALANCE', messageId, message.value)
  }

  @KafkaTopic('kafka.high_low_create')
  async highLowCreate(
    @MessageId() messageId: string,
    @Payload() message: KafkaMessage,
  ) {
    this.emitEvent('HIGH_LOW_CREATE', messageId, message.value)
  }

  @KafkaTopic('kafka.high_low_win')
  async highLowWin(
    @MessageId() messageId: string,
    @Payload() message: KafkaMessage,
  ) {
    this.emitEvent('HIGH_LOW_WIN', messageId, message.value)
  }

  @KafkaTopic('kafka.high_low_lost')
  async highLowLost(
    @MessageId() messageId: string,
    @Payload() message: KafkaMessage,
  ) {
    this.emitEvent('HIGH_LOW_LOST', messageId, message.value)
  }

  @KafkaTopic('kafka.high_low_cancel')
  async highLowCancel(
    @MessageId() messageId: string,
    @Payload() message: KafkaMessage,
  ) {
    this.emitEvent('HIGH_LOW_CANCEL', messageId, message.value)
  }
}
