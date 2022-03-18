import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { SendRewardToBalanceInput } from '../demo/demo.interface'
import { ExternalBalanceService } from '@lib/external-balance'
import { STATUS, UserRewardHistoryService } from '@lib/user-reward-history'

@Injectable()
export class ExternalListener {
  private readonly logger = new Logger(ExternalListener.name)

  constructor(
    private readonly externalBalanceService: ExternalBalanceService,
    private readonly userRewardHistoryService: UserRewardHistoryService,
  ) {}

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
