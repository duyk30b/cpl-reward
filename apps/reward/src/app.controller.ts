// import { Controller } from '@nestjs/common'
import { Controller, Get } from '@nestjs/common'
// import { AppService } from './app.service'
// import { RewardRuleService } from '@lib/reward-rule'
// import { IdGeneratorService } from '@lib/id-generator'

@Controller('main')
export class AppController {
  // constructor(
  //   private readonly idGeneratorService: IdGeneratorService,
  //   private readonly appService: AppService,
  //   private readonly rewardRuleService: RewardRuleService,
  // ) {}

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

  @Get('test')
  async test() {
    //   for (let i = 0; i < 100; i++) {
    //     await this.appService.waitforme()
    //     console.log(i)
    //   }

    // const id = this.idGeneratorService.generateId()

    return 'ok'
  }
}
