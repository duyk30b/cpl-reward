import { Process, Processor } from '@nestjs/bull'
import { QUEUE_SEND_BALANCE } from '@lib/queue'
import { Job } from 'bull'
import { plainToInstance } from 'class-transformer'
import { SendRewardToBalance } from './interfaces/external.interface'
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
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ExternalBalanceService } from '@lib/external-balance'
import { ExternalCashbackService } from '@lib/external-cashback'
import { MissionUserLogService } from '@lib/mission-user-log'

@Processor('banker_balance')
export class BankerBalanceProcessor {
  private eventEmit = 'write_log'

  constructor(
    private eventEmitter: EventEmitter2,
    private readonly externalBalanceService: ExternalBalanceService,
    private readonly userRewardHistoryService: UserRewardHistoryService,
    private readonly externalCashbackService: ExternalCashbackService,
    private readonly missionUserLogService: MissionUserLogService,
  ) {}

  @Process({ name: QUEUE_SEND_BALANCE, concurrency: 3 })
  async handleSendBalance(job: Job) {
    const data = plainToInstance(SendRewardToBalance, job.data)
    // console.log(data.userId + ' Bat dau cong balance: ', Date.now() / 1000)
    const sendRewardToBalance =
      await this.externalBalanceService.changeUserBalance(
        data.userId,
        data.amount,
        data.currency.toLowerCase(),
        data.type,
        data.data,
      )
    if (!sendRewardToBalance.result) {
      // Continue attempt
      if (job.attemptsMade < job.opts.attempts - 1) {
        throw new Error('Send real balance fail')
      }

      // Reach max attemptsMade => Job fail
      if (data.missionUserLogId) {
        await this.missionUserLogService.updateFailLog(
          data.missionUserLogId,
          sendRewardToBalance.message,
        )
      } else {
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
            note: [sendRewardToBalance.message],
          }),
          userType: data.userType,
          currency: data.currency,
          wallet: DELIVERY_METHOD_WALLET.DIRECT_BALANCE,
          status: MissionUserLogStatus.NEED_TO_RESOLVE,
          rewardHistoryId: data.id,
        })
      }

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
      // SUCCEED
      if (data.missionUserLogId) {
        await this.missionUserLogService.update(data.missionUserLogId, {
          status: MissionUserLogStatus.RESOLVED_BY_RETRY,
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
      }

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
}
