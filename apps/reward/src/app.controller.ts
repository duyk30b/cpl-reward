import { Controller } from '@nestjs/common'
// import { Controller, Get } from '@nestjs/common'
// import { ExternalCashbackService } from '@lib/external-cashback'
// import { ExternalBalanceService } from '@lib/external-balance'

@Controller('main')
export class AppController {
  // constructor(private readonly rewardRuleService: RewardRuleService) {}
  // @Get('debug_transaction')
  // async debugTransaction() {
  //   for (let i = 0; i < 100; i++) {
  //     new Promise(() => {
  //       this.rewardRuleService
  //         .safeIncreaseReleaseValue(46, '5.00004')
  //         .then((updated) => {
  //           console.log('Lan ' + i + ' ket qua' + updated.affected)
  //         })
  //     })
  //   }
  // }
  // constructor(
  //   private readonly externalCashbackService: ExternalCashbackService,
  //   private readonly externalBalanceService: ExternalBalanceService,
  // ) {}
  //
  // @Get('test')
  // async test() {
  //   await this.externalCashbackService.changeUserCashback({
  //     user_id: '64781',
  //     currency: 'USDTSSS',
  //     amount: '2.123',
  //     historyId: 100001,
  //     data: {},
  //   })
  //
  //   await this.externalBalanceService.changeUserBalance(
  //     '64781',
  //     '2.123',
  //     'USDT',
  //     'reward',
  //     {},
  //   )
  // }
}
