import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import {
  SendRewardToBalanceInput,
  SendRewardToCashbackInput,
} from '../demo/demo.interface'
import { ExternalBalanceService } from '@lib/external-balance'
import { STATUS, UserRewardHistoryService } from '@lib/user-reward-history'
import { ExternalBoService } from '@lib/external-bo'

@Injectable()
export class ExternalListener {
  private readonly logger = new Logger(ExternalListener.name)

  constructor(
    private readonly externalBalanceService: ExternalBalanceService,
    private readonly userRewardHistoryService: UserRewardHistoryService,
    private readonly externalBoService: ExternalBoService,
  ) {}

  @OnEvent('send_reward_to_cashback')
  async handleSendRewardToCashbackEvent(data: SendRewardToCashbackInput) {
    const sendRewardToCashback =
      await this.externalBoService.changeUserCashback({
        user_id: data.userId,
        currency: data.currency,
        amount: data.amount,
      })
    if (!sendRewardToCashback) {
      const result = await this.userRewardHistoryService.updateStatus(
        data.id,
        STATUS.FAIL,
      )
      if (result.affected === 0) {
        this.logger.error(
          `Update reward history fail. ` +
            `Input: id => ${data.id}, status => ${STATUS.FAIL}`,
        )
      }
      this.logger.error(
        'Send reward to cashback fail, detail: ' +
          JSON.stringify(sendRewardToCashback),
      )
      return
    }

    const result = await this.userRewardHistoryService.updateStatus(
      data.id,
      STATUS.AUTO_RECEIVED,
    )
    if (result.affected === 0) {
      this.logger.error(
        `Update reward history fail. ` +
          `Input: id => ${data.id}, status => ${STATUS.AUTO_RECEIVED}`,
      )
    }
  }

  @OnEvent('send_reward_to_balance')
  async handleSendRewardToBalanceEvent(data: SendRewardToBalanceInput) {
    const sendRewardToBalance =
      await this.externalBalanceService.changeUserBalance(
        data.userId,
        data.amount,
        data.currency.toLowerCase(),
        data.type,
      )
    if (!sendRewardToBalance) {
      const result = await this.userRewardHistoryService.updateStatus(
        data.id,
        STATUS.FAIL,
      )
      if (result.affected === 0) {
        this.logger.error(
          `Update reward history fail. ` +
            `Input: id => ${data.id}, status => ${STATUS.FAIL}`,
        )
      }
      this.logger.error(
        'Send reward to balance fail, detail: ' +
          JSON.stringify(sendRewardToBalance),
      )
      return
    }

    const result = await this.userRewardHistoryService.updateStatus(
      data.id,
      STATUS.AUTO_RECEIVED,
    )
    if (result.affected === 0) {
      this.logger.error(
        `Update reward history fail. ` +
          `Input: id => ${data.id}, status => ${STATUS.AUTO_RECEIVED}`,
      )
    }
  }
}
