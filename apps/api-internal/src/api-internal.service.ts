import { Injectable } from '@nestjs/common'
// import { ExternalBalanceService } from '@lib/external-balance'
// import { ExternalCashbackService } from '@lib/external-cashback'

@Injectable()
export class ApiInternalService {
  // constructor(
  //   private readonly externalBalanceService: ExternalBalanceService,
  //   private readonly externalCashbackService: ExternalCashbackService,
  // ) {}

  waitForMe() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('')
      }, 100)
    })
  }

  // async callDirectToCashback(referenceId: string) {
  //   return this.externalCashbackService.changeUserCashback({
  //     user_id: '64781',
  //     currency: 'USDT',
  //     amount: '1.0',
  //     referenceId: referenceId,
  //     data: {},
  //   })
  // }

  // async callDirectToBalance() {
  //   await this.externalBalanceService.changeUserBalance(
  //     '64781',
  //     '2.123',
  //     'USDT',
  //     'reward',
  //     {},
  //   )
  // }
}
