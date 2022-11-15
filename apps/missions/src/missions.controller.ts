import { Controller } from '@nestjs/common'
import { MessageId, KafkaMessage, KafkaTopic } from '@lib/kafka'
import { Payload } from '@nestjs/microservices'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { MissionsService } from './missions.service'
import { EventEmitterType } from '@lib/common'
import { ORDER_TYPE_LABEL, UserType } from '@lib/mission'
import { IExchangeConfirmOrderMatchTransform } from './interfaces/exchange_confirm_order_match.interface'
import { KafkaExchangeConfirmOrderMatchDto } from './dto/exchange_confirm_order_match.dto'
import { QUEUE_EVENT_HANDLER, QUEUE_WRITE_LOG, QueueService } from '@lib/queue'

@Controller()
export class MissionsController {
  eventEmit = EventEmitterType.WRITE_LOG

  constructor(
    private eventEmitter: EventEmitter2,
    private missionsService: MissionsService,
    private readonly queueService: QueueService,
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
        traceCode: 'm016',
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

    // Transform user_id to string
    msgData.user_id = msgData.user_id.toString()

    // Push kafka event to Queue
    this.queueService
      .addEventHandlerJob(
        QUEUE_WRITE_LOG,
        {
          logLevel: 'log',
          traceCode: 'Received event',
          data: {
            msgData,
            msgName,
            msgId,
          },
        },
        {
          attempts: 0,
          backoff: 1000,
          removeOnComplete: true,
        },
      )
      .then()

    this.queueService
      .addEventHandlerJob(
        QUEUE_EVENT_HANDLER,
        {
          msgId,
          msgName,
          msgData,
        },
        {
          removeOnComplete: true,
        },
      )
      .then()
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

  @KafkaTopic('kafka.exchange_confirm_order_match')
  async newExchangeConfirmOrderMatch(
    @MessageId() messageId: string,
    @Payload() message: KafkaExchangeConfirmOrderMatchDto,
  ) {
    const transactionData = message.value
    const order = transactionData.data.order

    const originData = order.origin
    const matchData = order.match

    // TODO: Define to use net_volume or gross_volume
    const quantity = parseFloat(transactionData.data.filled.gross_volume)

    // Transform data
    const originTradeType = ORDER_TYPE_LABEL[originData.order_type] || ''
    const matchTradeType = ORDER_TYPE_LABEL[matchData.order_type] || ''

    const originTradingData: IExchangeConfirmOrderMatchTransform = {
      trade_type: originTradeType,
      user_id: parseInt(originData.user_id),
      currency: originData.currency,
      coin: originData.coin,
      quantity: quantity,
    }
    const matchTradingData: IExchangeConfirmOrderMatchTransform = {
      trade_type: matchTradeType,
      user_id: parseInt(matchData.user_id),
      currency: matchData.currency,
      coin: matchData.coin,
      quantity: quantity,
    }

    if (originData.user_type === UserType.User) {
      this.emitEvent(
        'EXCHANGE_CONFIRM_ORDER_MATCH',
        messageId,
        originTradingData,
      )
    }

    if (matchData.user_type === UserType.User) {
      this.emitEvent(
        'EXCHANGE_CONFIRM_ORDER_MATCH',
        messageId,
        matchTradingData,
      )
    }
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

  @KafkaTopic('kafka.high_low_lose')
  async highLowLost(
    @MessageId() messageId: string,
    @Payload() message: KafkaMessage,
  ) {
    this.emitEvent('HIGH_LOW_LOSE', messageId, message.value)
  }

  @KafkaTopic('kafka.high_low_cancel')
  async highLowCancel(
    @MessageId() messageId: string,
    @Payload() message: KafkaMessage,
  ) {
    this.emitEvent('HIGH_LOW_CANCEL', messageId, message.value)
  }

  @KafkaTopic('kafka.reward_user_check_in')
  async rewardUserCheckin(
    @MessageId() messageId: string,
    @Payload() message: KafkaMessage,
  ) {
    this.emitEvent('REWARD_USER_CHECK_IN', messageId, message.value.data ?? {})
  }
}
