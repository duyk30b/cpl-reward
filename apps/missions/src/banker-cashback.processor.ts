import { Process, Processor } from '@nestjs/bull'
import { QUEUE_SEND_CASHBACK } from '@lib/queue'
import { Job } from 'bull'
import { plainToInstance } from 'class-transformer'
import { SendRewardToCashback } from './interfaces/external.interface'
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

@Processor('banker_cashback')
export class BankerCashbackProcessor {
  private eventEmit = 'write_log'

  constructor(
    private eventEmitter: EventEmitter2,
    private readonly externalBalanceService: ExternalBalanceService,
    private readonly userRewardHistoryService: UserRewardHistoryService,
    private readonly externalCashbackService: ExternalCashbackService,
    private readonly missionUserLogService: MissionUserLogService,
  ) {}

  @Process(QUEUE_SEND_CASHBACK)
  async handleSendCashback(job: Job) {
    const data = plainToInstance(SendRewardToCashback, job.data)
    //console.log(data.userId + ' Bat dau cong cashback: ', Date.now() / 1000)
    const sendRewardToCashback =
      await this.externalCashbackService.changeUserCashback({
        user_id: data.userId,
        currency: data.currency,
        amount: data.amount,
        referenceId: data.referenceId,
        data: data.data,
      })
    if (!sendRewardToCashback.result) {
      // Continue attempt
      if (job.attemptsMade < job.opts.attempts - 1) {
        throw new Error('Send real balance fail')
      }

      if (data.missionUserLogId) {
        await this.missionUserLogService.updateFailLog(
          data.missionUserLogId,
          sendRewardToCashback.message,
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
            note: [sendRewardToCashback.message],
          }),
          userType: data.userType,
          currency: data.currency,
          wallet: DELIVERY_METHOD_WALLET.DIRECT_CASHBACK,
          status: MissionUserLogStatus.NEED_TO_RESOLVE,
          rewardHistoryId: data.historyId,
        })
      }

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

    // SUCCEED
    if (data.missionUserLogId) {
      await this.missionUserLogService.update(data.missionUserLogId, {
        status: MissionUserLogStatus.RESOLVED_BY_RETRY,
      })
    } else {
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
    }

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
