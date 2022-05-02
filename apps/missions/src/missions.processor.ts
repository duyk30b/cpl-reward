import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import {
  QUEUE_MISSION_MAIN_FUNCTION,
  QUEUE_SEND_BALANCE,
  QUEUE_SEND_CASHBACK,
} from '@lib/queue'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  EventEmitterType,
  MissionUserLogNoteCode,
  MissionUserLogStatus,
} from '@lib/common'
import { DELIVERY_METHOD_WALLET } from '@lib/mission'
import {
  USER_REWARD_STATUS,
  UserRewardHistoryService,
} from '@lib/user-reward-history'
import { ExternalBalanceService } from '@lib/external-balance'
import { ExternalCashbackService } from '@lib/external-cashback'
import { plainToInstance } from 'class-transformer'
import {
  SendRewardToBalance,
  SendRewardToCashback,
} from './interfaces/external.interface'
import { MissionsService } from './missions.service'

@Processor('reward')
export class MissionsProcessor {
  private eventEmit = 'write_log'

  private readonly logger = new Logger(MissionsProcessor.name)

  constructor(
    private missionsService: MissionsService,
    private eventEmitter: EventEmitter2,
    private readonly externalBalanceService: ExternalBalanceService,
    private readonly userRewardHistoryService: UserRewardHistoryService,
    private readonly externalCashbackService: ExternalCashbackService,
  ) {}

  @Process(QUEUE_MISSION_MAIN_FUNCTION)
  handleMainFunction(job: Job) {
    this.missionsService.mainFunction(job.data).then()
  }
  @Process(QUEUE_SEND_BALANCE)
  async handleSendBalance(job: Job) {
    const data = plainToInstance(SendRewardToBalance, job.data)
    // console.log(data.userId + ' Bat dau cong balance: ', Date.now())
    const sendRewardToBalance =
      await this.externalBalanceService.changeUserBalance(
        data.userId,
        data.amount,
        data.currency.toLowerCase(),
        data.type,
        data.data,
      )
    if (!sendRewardToBalance) {
      // Continue attempt
      if (job.attemptsMade < job.opts.attempts - 1) {
        throw new Error('Send real balance fail')
      }

      // Reach max attemptsMade => Job fail
      this.eventEmitter.emit(EventEmitterType.CREATE_MISSION_USER_LOG, {
        campaignId: data.data.campaignId,
        missionId: data.data.missionId,
        userId: data.userId,
        successCount: 0,
        moneyEarned: data.amount,
        note: JSON.stringify({
          event: data.data.msgName,
          result: 'Failed to release money',
          statusCode: MissionUserLogNoteCode.FAILED_RELEASE_MONEY,
        }),
        userType: data.userType,
        currency: data.currency,
        wallet: DELIVERY_METHOD_WALLET.DIRECT_BALANCE,
        status: MissionUserLogStatus.NEED_TO_RESOLVE,
        rewardHistoryId: data.id,
      })

      const history = await this.userRewardHistoryService.updateById(data.id, {
        status: USER_REWARD_STATUS.FAIL,
      })
      if (history.affected === 0) {
        this.eventEmitter.emit(this.eventEmit, {
          logLevel: 'error',
          traceCode: 'm013',
          data: data.data,
          extraData: {
            id: data.id,
            status: USER_REWARD_STATUS.FAIL,
          },
        })
      }

      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'error',
        traceCode: 'm014',
        data: data.data,
        extraData: {
          sendRewardToBalance: JSON.stringify(sendRewardToBalance),
        },
        params: { type: 'balance' },
      })
    } else {
      // Save success log to user_mission_log
      this.eventEmitter.emit(EventEmitterType.CREATE_MISSION_USER_LOG, {
        campaignId: data.data.campaignId,
        missionId: data.data.missionId,
        userId: data.userId,
        successCount: 0,
        moneyEarned: data.amount,
        note: JSON.stringify({
          event: data.data.msgName,
          result: 'Success',
          statusCode: MissionUserLogNoteCode.SUCCESS,
        }),
        userType: data.userType,
        currency: data.currency,
        wallet: DELIVERY_METHOD_WALLET.DIRECT_BALANCE,
        status: MissionUserLogStatus.IGNORE,
        rewardHistoryId: data.id,
      })

      const result = await this.userRewardHistoryService.updateById(data.id, {
        status: USER_REWARD_STATUS.RECEIVED,
      })
      if (result.affected === 0) {
        this.eventEmitter.emit(this.eventEmit, {
          logLevel: 'error',
          traceCode: 'm013',
          data: data.data,
          extraData: {
            id: data.id,
            status: USER_REWARD_STATUS.RECEIVED,
          },
        })
      }
    }
  }

  @Process(QUEUE_SEND_CASHBACK)
  async handleSendCashback(job: Job) {
    const data = plainToInstance(SendRewardToCashback, job.data)
    // console.log(data.userId + ' Bat dau cong cashback: ', Date.now())
    const sendRewardToCashback =
      await this.externalCashbackService.changeUserCashback({
        user_id: data.userId,
        currency: data.currency,
        amount: data.amount,
        referenceId: data.referenceId,
        data: data.data,
      })
    if (!sendRewardToCashback) {
      // Continue attempt
      if (job.attemptsMade < job.opts.attempts - 1) {
        throw new Error('Send real balance fail')
      }

      this.eventEmitter.emit(EventEmitterType.CREATE_MISSION_USER_LOG, {
        campaignId: data.data.campaignId,
        missionId: data.data.missionId,
        userId: data.userId,
        successCount: 0,
        moneyEarned: data.amount,
        note: JSON.stringify({
          event: data.data.msgName,
          result: 'Failed to release money',
          statusCode: MissionUserLogNoteCode.FAILED_RELEASE_MONEY,
        }),
        userType: data.userType,
        currency: data.currency,
        wallet: DELIVERY_METHOD_WALLET.DIRECT_CASHBACK,
        status: MissionUserLogStatus.NEED_TO_RESOLVE,
        rewardHistoryId: data.historyId,
      })

      const result = await this.userRewardHistoryService.updateById(data.id, {
        status: USER_REWARD_STATUS.FAIL,
      })
      if (result.affected === 0) {
        this.eventEmitter.emit(this.eventEmit, {
          logLevel: 'warn',
          traceCode: 'm013',
          data: data.data,
          extraData: {
            id: data.id,
            status: USER_REWARD_STATUS.FAIL,
          },
        })
      }

      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm014',
        data: data.data,
        extraData: {
          sendRewardToBalance: JSON.stringify(sendRewardToCashback),
        },
        params: { type: 'cashback' },
      })
      return
    }

    this.eventEmitter.emit(EventEmitterType.CREATE_MISSION_USER_LOG, {
      campaignId: data.data.campaignId,
      missionId: data.data.missionId,
      userId: data.userId,
      successCount: 0,
      moneyEarned: data.amount,
      note: JSON.stringify({
        event: data.data.msgName,
        result: 'Success',
        statusCode: MissionUserLogNoteCode.SUCCESS,
      }),
      userType: data.userType,
      currency: data.currency,
      wallet: DELIVERY_METHOD_WALLET.DIRECT_CASHBACK,
      status: MissionUserLogStatus.IGNORE,
      rewardHistoryId: data.historyId,
    })

    const result = await this.userRewardHistoryService.updateById(data.id, {
      status: USER_REWARD_STATUS.RECEIVED,
    })
    if (result.affected === 0) {
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm013',
        data: data.data,
        extraData: {
          id: data.id,
          status: USER_REWARD_STATUS.RECEIVED,
        },
      })
    }
  }
}
