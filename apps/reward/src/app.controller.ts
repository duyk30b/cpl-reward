import { Controller } from '@nestjs/common'

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
}
