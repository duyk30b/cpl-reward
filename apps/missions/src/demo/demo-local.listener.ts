import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { DemoService } from './demo.service'
import { SendRewardToBalanceInput } from './demo.interface'
import { ExternalBalanceService } from '@lib/external-balance'
import { RewardRuleService } from '@lib/reward-rule'
import { MissionUserLogService } from '@lib/mission-user-log'
import { EventMissionUserLog } from '@lib/common/interfaces/event-mission-user-log'
import { plainToInstance } from 'class-transformer'
import { MissionUserLog } from '@lib/mission-user-log/entities/mission-user-log.entity'

@Injectable()
export class DemoLocalListener {
  private readonly logger = new Logger(DemoLocalListener.name)

  constructor(
    private readonly demoService: DemoService,
    private readonly externalBalanceService: ExternalBalanceService,
    private readonly rewardRuleService: RewardRuleService,
    private readonly missionUserLogService: MissionUserLogService,
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
      this.logger.error(
        'Send reward to balance fail, detail: ' +
          JSON.stringify(sendRewardToBalance),
      )
      return
    }
    this.logger.log(`[STEP 4] Send reward to balance success`)

    this.logger.log(`[STEP 5] Update reward unit in campaign`)
    const campaignRewardRule = await this.rewardRuleService.findOne({
      campaignId: data.campaignId,
      typeRule: 'campaign',
      currency: data.currency,
    })
    this.logger.log(
      `[STEP 5.1] Before unit, releaseValue: ${campaignRewardRule.releaseValue}, limitValue: ${campaignRewardRule.limitValue}`,
    )
    campaignRewardRule.releaseValue++
    campaignRewardRule.limitValue--
    // await this.rewardRuleService.update(campaignRewardRule)
    this.logger.log(
      `[STEP 5.2] After unit, releaseValue: ${campaignRewardRule.releaseValue}, limitValue: ${campaignRewardRule.limitValue}`,
    )

    this.logger.log(`[STEP 6] Update reward unit in mission`)
    const missionRewardRule = await this.rewardRuleService.findOne({
      campaignId: data.campaignId,
      missionId: data.missionId,
      typeRule: 'mission',
      currency: data.currency,
    })
    this.logger.log(
      `[STEP 6.1] Before unit, releaseValue: ${missionRewardRule.releaseValue}, limitValue: ${missionRewardRule.limitValue}`,
    )
    missionRewardRule.releaseValue++
    missionRewardRule.limitValue--
    // await this.rewardRuleService.update(missionRewardRule)
    this.logger.log(
      `[STEP 6.2] After unit, releaseValue: ${missionRewardRule.releaseValue}, limitValue: ${missionRewardRule.limitValue}`,
    )

    this.logger.log(`[STEP 7] Logging`)
  }

  @OnEvent('event_log_*')
  handleCampaignLog(event: EventMissionUserLog) {
    const missionUserLog = plainToInstance(MissionUserLog, event.missionUser, {
      ignoreDecorators: true,
      excludePrefixes: ['id'],
    })
    let note = ''
    if (event.isNewUser) {
      note += 'User join the mission. '
    }

    if (event.isGiveRewardSuccess) {
      note += 'Give reward successfully. '
    }

    // const eventName = event.name.replace(missionConfig.eventLogPrefix, '')
    // switch (eventName) {
    //   case 'userSpendMoney':
    //     note +=
    //       'User spent ' +
    //       event.extraData.hlUserSpendMoney.amount +
    //       ' ' +
    //       event.extraData.hlUserSpendMoney.currency +
    //       ' in HL mode. '
    //     break
    //   default:
    //     break
    // }
    //
    // missionUserLog.note = note
    // this.missionUserLogService.save(missionUserLog)
  }
}
