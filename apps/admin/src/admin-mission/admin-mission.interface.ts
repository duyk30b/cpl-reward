import { CreateRewardRuleDto } from '@lib/reward-rule/dto/create-reward-rule.dto'
import { UpdateRewardRuleDto } from '@lib/reward-rule/dto/update-reward-rule.dto'
import { Expose, Type } from 'class-transformer'
import { TargetDto } from '@lib/mission/dto/target.dto'
import { JudgmentConditionDto } from '@lib/mission/dto/judgment-condition.dto'
import { UserConditionDto } from '@lib/mission/dto/user-condition.dto'

class IMission {
  @Expose({ name: 'campaign_id' })
  campaignId: number
  @Expose()
  title: string
  @Expose({ name: 'title_ja' })
  titleJa: string

  @Expose({ name: 'detail_explain' })
  detailExplain: string

  @Expose({ name: 'detail_explain_ja' })
  detailExplainJa: string

  @Expose({ name: 'guide_link' })
  guideLink?: string

  @Expose({ name: 'guide_link_ja' })
  guideLinkJa?: string

  @Expose({ name: 'opening_date' })
  openingDate: number

  @Expose({ name: 'closing_date' })
  closingDate: number

  @Expose()
  priority?: number

  @Expose({ name: 'limit_received_reward' })
  limitReceivedReward?: number

  @Expose()
  status?: number

  @Expose({ name: 'is_active' })
  isActive?: number

  @Expose({ name: 'target_type' })
  targetType?: number

  @Type(() => JudgmentConditionDto)
  @Expose({ name: 'judgment_conditions' })
  judgmentConditions: JudgmentConditionDto[]
  @Type(() => UserConditionDto)
  @Expose({ name: 'user_conditions' })
  userConditions: UserConditionDto[]

  @Type(() => UserConditionDto)
  @Expose({ name: 'display_conditions' })
  displayConditions: UserConditionDto[]

  @Type(() => TargetDto)
  @Expose({ name: 'grant_target' })
  grantTarget: TargetDto[]
}

export class ICreateMission extends IMission {
  @Type(() => CreateRewardRuleDto)
  @Expose({ name: 'reward_rules' })
  rewardRules: CreateRewardRuleDto[]
}

export class IUpdateMission extends IMission {
  @Expose()
  id: number

  @Type(() => CreateRewardRuleDto)
  @Expose({ name: 'reward_rules' })
  rewardRules: UpdateRewardRuleDto[]
}

export interface MissionFilterInput {
  campaignId: number
}
