import { Process, Processor } from '@nestjs/bull'
import { QUEUE_NAME_SEND_REWARD, QUEUE_SEND_REWARD } from '@lib/queue'
import { Job } from 'bull'
import { plainToInstance } from 'class-transformer'
import { SendRewardJob } from './interfaces/external.interface'
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
import { MissionUserLogService } from '@lib/mission-user-log'
import { BalanceType } from '@libs/new-balance/grpc-services/transaction/transaction.enum'
import { NewBalanceService } from '@libs/new-balance'

@Processor(QUEUE_NAME_SEND_REWARD)
export class SendRewardProcessor {
  private eventEmit = EventEmitterType.WRITE_LOG

  constructor(
    private eventEmitter: EventEmitter2,
    private readonly userRewardHistoryService: UserRewardHistoryService,
    private readonly missionUserLogService: MissionUserLogService,
    private newBalanceService: NewBalanceService,
  ) {}

  @Process({ name: QUEUE_SEND_REWARD, concurrency: 3 })
  async handleSendReward(job: Job) {
    const data = plainToInstance(SendRewardJob, job.data)

    // Xác định loại ví để cộng tiền
    const deliveryMethodWallet = data.deliveryMethodWallet
    let balanceType = BalanceType.EXCHANGE

    // Cộng tiền qua BALANCE
    if (deliveryMethodWallet === DELIVERY_METHOD_WALLET.DIRECT_BALANCE) {
      balanceType = BalanceType.EXCHANGE
    }

    // Cộng tiền qua CASHBACK
    if (deliveryMethodWallet === DELIVERY_METHOD_WALLET.DIRECT_CASHBACK) {
      balanceType = BalanceType.CASHBACK
    }

    // Cộng tiền qua REWARD
    if (deliveryMethodWallet === DELIVERY_METHOD_WALLET.DIRECT_REWARD) {
      balanceType = BalanceType.REWARD
    }

    // console.log(data.userId + ' Bat dau cong balance: ', Date.now() / 1000)
    const sendReward = await this.newBalanceService.sendReward(
      data.userId,
      data.amount,
      data.currency.toLowerCase(),
      data.referenceId,
      balanceType,
      data.data,
    )
    if (!sendReward.result) {
      // Continue attempt
      if (job.attemptsMade < job.opts.attempts - 1) {
        throw new Error('Send real balance fail')
      }

      // Reach max attemptsMade => Job fail
      if (data.missionUserLogId) {
        await this.missionUserLogService.updateFailLog(
          data.missionUserLogId,
          sendReward.message,
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
            note: [sendReward.message],
          }),
          userType: data.userType,
          currency: data.currency,
          wallet: deliveryMethodWallet,
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
          sendReward: JSON.stringify(sendReward),
        },
        params: { type: BalanceType[balanceType] },
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
          wallet: deliveryMethodWallet,
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
