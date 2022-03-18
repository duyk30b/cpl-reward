import { Injectable } from '@nestjs/common'
import { Campaign } from '@lib/campaign/entities/campaign.entity'
import { CampaignService } from '@lib/campaign'
import { EVENTS, MissionService } from '@lib/mission'
import { MissionEventService } from '@lib/mission-event'
import { RewardRuleService } from '@lib/reward-rule'
import { IUser, JudgmentCondition, UserCondition } from './demo.interface'

@Injectable()
export class DemoService {
  constructor(
    private readonly campaignService: CampaignService,
    private readonly missionService: MissionService,
    private readonly missionEventService: MissionEventService,
    private readonly rewardRuleService: RewardRuleService,
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

  async getRulesByIds(campaignId: number, missionId: number) {
    return this.rewardRuleService.find({ campaignId, missionId })
  }

  checkJudgmentConditions(
    judgmentConditions: JudgmentCondition[],
    messageValue: any,
  ) {
    let result = false
    for (const idx in judgmentConditions) {
      const currentCondition = judgmentConditions[idx]
      if (currentCondition.eventName !== EVENTS.AUTH_USER_LOGIN) continue

      const checkExistMessageValue = messageValue[currentCondition.property]
      if (checkExistMessageValue === undefined) continue

      const checkJudgmentCondition = eval(`${DemoService.inspectStringNumber(
        messageValue[currentCondition.property],
      )}
            ${currentCondition.operator}
            ${DemoService.inspectStringNumber(currentCondition.value)}`)
      if (!checkJudgmentCondition) break
      result = true
    }
    return result
  }

  private static inspectStringNumber(input: string | number) {
    if (typeof input === 'string') return `'${input}'`
    return input
  }

  checkUserConditions(userConditions: UserCondition[], user: IUser) {
    let result = false
    for (const idx in userConditions) {
      const currentCondition = userConditions[idx]

      const checkExistUserProperty = user[currentCondition.property]
      if (checkExistUserProperty === undefined) continue

      const checkUserCondition = eval(`${DemoService.inspectStringNumber(
        user[currentCondition.property],
      )}
            ${currentCondition.operator}
            ${DemoService.inspectStringNumber(currentCondition.value)}`)
      if (!checkUserCondition) break
      result = true
    }
    return result
  }
}
