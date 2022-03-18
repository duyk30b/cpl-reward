import { Injectable, Logger } from '@nestjs/common'
import { Campaign } from '@lib/campaign/entities/campaign.entity'
import { CampaignService } from '@lib/campaign'
import { GRANT_TARGET_WALLET, MissionService } from '@lib/mission'
import { MissionEventService } from '@lib/mission-event'
import { RewardRule } from '@lib/reward-rule/entities/reward-rule.entity'
import { RewardRuleService, TYPE_RULE } from '@lib/reward-rule'
import { Target } from './demo.interface'
import { UserRewardHistoryService } from '@lib/user-reward-history'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class DemoService {
  private readonly logger = new Logger(DemoService.name)

  constructor(
    private eventEmitter: EventEmitter2,
    private readonly campaignService: CampaignService,
    private readonly missionService: MissionService,
    private readonly missionEventService: MissionEventService,
    private readonly rewardRuleService: RewardRuleService,
    private readonly userRewardHistoryService: UserRewardHistoryService,
  ) {}

  async getEventsByName(eventName: string) {
    return await this.missionEventService.findOneByEventName(eventName)
  }

  async getCampaignById(campaignId: number): Promise<Campaign> {
    const campaign = await this.campaignService.getById(campaignId)
    if (!campaign) return null
    return campaign
  }

  async getMissionById(missionId: number) {
    const mission = await this.missionService.getById(missionId)
    if (!mission) return null
    return mission
  }

  async updateReleaseLimitValue(
    missionRewardRule: RewardRule,
    campaignId: number,
    amount: number,
    type: string,
    currency: string,
  ) {
    const updateMissionRewardRule = await this.rewardRuleService.updateValue(
      missionRewardRule,
      amount,
    )
    if (updateMissionRewardRule.affected === 0) {
      this.logger.error(
        `Update Value of Reward Rule fail, ` +
          `input: rewardRule => ${JSON.stringify(missionRewardRule)}` +
          `, amount => ${amount}`,
      )
    }
    const campaignRewardRules = await this.rewardRuleService.find({
      campaignId: campaignId,
      typeRule: TYPE_RULE.CAMPAIGN,
    })
    if (campaignRewardRules.length > 0) {
      for (const idx in campaignRewardRules) {
        if (
          campaignRewardRules[idx].currency !== currency ||
          campaignRewardRules[idx].key !== type
        )
          continue

        await this.rewardRuleService.updateValue(
          campaignRewardRules[idx],
          amount,
        )
      }
    }
  }

  async commonFlowReward(
    missionRewardRule: RewardRule,
    campaignId: number,
    userTarget: Target,
    userId: number,
    missionId: number,
  ) {
    // update release_value, limit_value of campaign/mission
    await this.updateReleaseLimitValue(
      missionRewardRule,
      campaignId,
      userTarget.amount,
      userTarget.type,
      userTarget.currency,
    )

    const userRewardHistory = await this.userRewardHistoryService.save({
      campaignId: campaignId,
      missionId: missionId,
      userId,
      userType: userTarget.user,
      amount: userTarget.amount,
      currency: userTarget.currency,
      wallet: GRANT_TARGET_WALLET[userTarget.wallet],
    })

    if (
      GRANT_TARGET_WALLET[userTarget.wallet] ===
        GRANT_TARGET_WALLET.DIRECT_BALANCE &&
      userRewardHistory
    ) {
      this.eventEmitter.emit('send_reward_to_balance', {
        id: userRewardHistory.id,
        userId: userId,
        amount: userTarget.amount,
        currency: userTarget.currency,
        // TODO: recheck below value
        type: 'balance',
      })
    }
  }
}
