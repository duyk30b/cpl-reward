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

@Injectable()
export class ExternalListener {
  eventEmit = 'write_log'

  constructor(
    private eventEmitter: EventEmitter2,
    private readonly externalBalanceService: ExternalBalanceService,
    private readonly userRewardHistoryService: UserRewardHistoryService,
    private readonly externalCashbackService: ExternalCashbackService,
  ) {}

  @OnEvent('send_reward_to_cashback')
  async handleSendRewardToCashbackEvent(input: ISendRewardToCashback) {
    const sendRewardToCashback =
      await this.externalCashbackService.changeUserCashback({
        user_id: input.userId,
        currency: input.currency,
        amount: input.amount,
        historyId: input.historyId,
        data: input.data,
      })
    if (sendRewardToCashback === null) {
      const result = await this.userRewardHistoryService.updateById(input.id, {
        status: USER_REWARD_STATUS.AUTO_FAIL,
      })
      if (result.affected === 0) {
        this.eventEmitter.emit(this.eventEmit, {
          logLevel: 'warn',
          traceCode: 'm013',
          data: input.data,
          extraData: {
            id: input.id,
            status: USER_REWARD_STATUS.AUTO_FAIL,
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

    const result = await this.userRewardHistoryService.updateById(input.id, {
      status: USER_REWARD_STATUS.AUTO_RECEIVED,
    })
    if (result.affected === 0) {
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm013',
        data: input.data,
        extraData: {
          id: input.id,
          status: USER_REWARD_STATUS.AUTO_RECEIVED,
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
      const result = await this.userRewardHistoryService.updateById(input.id, {
        status: USER_REWARD_STATUS.AUTO_FAIL,
      })
      if (result.affected === 0) {
        this.eventEmitter.emit(this.eventEmit, {
          logLevel: 'warn',
          traceCode: 'm013',
          data: input.data,
          extraData: {
            id: input.id,
            status: USER_REWARD_STATUS.AUTO_FAIL,
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

    const result = await this.userRewardHistoryService.updateById(input.id, {
      status: USER_REWARD_STATUS.AUTO_RECEIVED,
    })
    if (result.affected === 0) {
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm013',
        data: input.data,
        extraData: {
          id: input.id,
          status: USER_REWARD_STATUS.AUTO_RECEIVED,
        },
      })
    }
  }
}
