import { Injectable } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import {
  ISendRewardToBalance,
  ISendRewardToCashback,
} from '../interfaces/external.interface'
import { ExternalBalanceService } from '@lib/external-balance'
import {
  USER_REWARD_STATUS,
  UserRewardHistoryService,
} from '@lib/user-reward-history'
import { ExternalCashbackService } from '@lib/external-cashback'
import {
  EventEmitterType,
  MissionUserLogNoteCode,
  MissionUserLogStatus,
} from '@lib/common'
import { DELIVERY_METHOD_WALLET } from '@lib/mission'
import { IdGeneratorService } from '@lib/id-generator'

@Injectable()
export class ExternalListener {
  eventEmit = 'write_log'

  constructor(
    private eventEmitter: EventEmitter2,
    private readonly externalBalanceService: ExternalBalanceService,
    private readonly userRewardHistoryService: UserRewardHistoryService,
    private readonly externalCashbackService: ExternalCashbackService,
    private readonly idGeneratorService: IdGeneratorService,
  ) {}

  @OnEvent('send_reward_to_cashback')
  async handleSendRewardToCashbackEvent(input: ISendRewardToCashback) {
    const referenceId = this.idGeneratorService.generateId()
    const sendRewardToCashback =
      await this.externalCashbackService.changeUserCashback({
        user_id: input.userId,
        currency: input.currency,
        amount: input.amount,
        referenceId: referenceId.toString(),
        data: input.data,
      })
    if (sendRewardToCashback === null) {
      this.eventEmitter.emit(EventEmitterType.CREATE_MISSION_USER_LOG, {
        campaignId: input.data.campaignId,
        missionId: input.data.missionId,
        userId: input.userId,
        successCount: 0,
        moneyEarned: input.amount,
        note: JSON.stringify({
          event: input.data.msgName,
          result: 'Failed to release money',
          statusCode: MissionUserLogNoteCode.FAILED_RELEASE_MONEY,
        }),
        userType: input.userType,
        currency: input.currency,
        wallet: DELIVERY_METHOD_WALLET.DIRECT_CASHBACK,
        status: MissionUserLogStatus.NEED_TO_RESOLVE,
        rewardHistoryId: input.historyId,
      })

      const result = await this.userRewardHistoryService.updateById(input.id, {
        status: USER_REWARD_STATUS.FAIL,
      })
      if (result.affected === 0) {
        this.eventEmitter.emit(this.eventEmit, {
          logLevel: 'warn',
          traceCode: 'm013',
          data: input.data,
          extraData: {
            id: input.id,
            status: USER_REWARD_STATUS.FAIL,
          },
        })
      }

      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm014',
        data: input.data,
        extraData: {
          sendRewardToBalance: JSON.stringify(sendRewardToCashback),
        },
        params: { type: 'cashback' },
      })
      return
    }

    this.eventEmitter.emit(EventEmitterType.CREATE_MISSION_USER_LOG, {
      campaignId: input.data.campaignId,
      missionId: input.data.missionId,
      userId: input.userId,
      successCount: 0,
      moneyEarned: input.amount,
      note: JSON.stringify({
        event: input.data.msgName,
        result: 'Success',
        statusCode: MissionUserLogNoteCode.SUCCESS,
      }),
      userType: input.userType,
      currency: input.currency,
      wallet: DELIVERY_METHOD_WALLET.DIRECT_CASHBACK,
      status: MissionUserLogStatus.IGNORE,
      rewardHistoryId: input.historyId,
    })

    const result = await this.userRewardHistoryService.updateById(input.id, {
      status: USER_REWARD_STATUS.RECEIVED,
    })
    if (result.affected === 0) {
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm013',
        data: input.data,
        extraData: {
          id: input.id,
          status: USER_REWARD_STATUS.RECEIVED,
        },
      })
    }
  }

  @OnEvent('send_reward_to_balance')
  async handleISendRewardToBalanceEvent(input: ISendRewardToBalance) {
    const sendRewardToBalance =
      await this.externalBalanceService.changeUserBalance(
        input.userId,
        input.amount,
        input.currency.toLowerCase(),
        input.type,
        input.data,
      )
    if (sendRewardToBalance === null) {
      this.eventEmitter.emit(EventEmitterType.CREATE_MISSION_USER_LOG, {
        campaignId: input.data.campaignId,
        missionId: input.data.missionId,
        userId: input.userId,
        successCount: 0,
        moneyEarned: input.amount,
        note: JSON.stringify({
          event: input.data.msgName,
          result: 'Failed to release money',
          statusCode: MissionUserLogNoteCode.FAILED_RELEASE_MONEY,
        }),
        userType: input.userType,
        currency: input.currency,
        wallet: DELIVERY_METHOD_WALLET.DIRECT_BALANCE,
        status: MissionUserLogStatus.NEED_TO_RESOLVE,
        rewardHistoryId: input.id,
      })

      const result = await this.userRewardHistoryService.updateById(input.id, {
        status: USER_REWARD_STATUS.FAIL,
      })
      if (result.affected === 0) {
        this.eventEmitter.emit(this.eventEmit, {
          logLevel: 'warn',
          traceCode: 'm013',
          data: input.data,
          extraData: {
            id: input.id,
            status: USER_REWARD_STATUS.FAIL,
          },
        })
      }

      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm014',
        data: input.data,
        extraData: {
          sendRewardToBalance: JSON.stringify(sendRewardToBalance),
        },
        params: { type: 'balance' },
      })
      return
    }

    // Save success log to user_mission_log
    this.eventEmitter.emit(EventEmitterType.CREATE_MISSION_USER_LOG, {
      campaignId: input.data.campaignId,
      missionId: input.data.missionId,
      userId: input.userId,
      successCount: 0,
      moneyEarned: input.amount,
      note: JSON.stringify({
        event: input.data.msgName,
        result: 'Success',
        statusCode: MissionUserLogNoteCode.SUCCESS,
      }),
      userType: input.userType,
      currency: input.currency,
      wallet: DELIVERY_METHOD_WALLET.DIRECT_BALANCE,
      status: MissionUserLogStatus.IGNORE,
      rewardHistoryId: input.id,
    })

    const result = await this.userRewardHistoryService.updateById(input.id, {
      status: USER_REWARD_STATUS.RECEIVED,
    })
    if (result.affected === 0) {
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm013',
        data: input.data,
        extraData: {
          id: input.id,
          status: USER_REWARD_STATUS.RECEIVED,
        },
      })
    }
  }
}
