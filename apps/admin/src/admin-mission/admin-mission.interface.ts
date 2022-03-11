import { CreateRewardRuleDto } from '@lib/reward-rule/dto/create-reward-rule.dto'
import { UpdateRewardRuleDto } from '@lib/reward-rule/dto/update-reward-rule.dto'

interface MissionInput {
  campaignId: number
  title: string
  detailExplain: string
  openingDate: number
  closingDate: number
  judgmentConditions: JudgmentCondition[]
  userConditions: UserCondition[]
  grantTarget: Target[]
  priority: number
}

interface JudgmentCondition {
  eventName: string
  property: string
  operator: string
  value: string
}

interface UserCondition {
  property: string
  operator: string
  value: string
}

interface Target {
  user: string
  amount: number
  currency: string
  wallet: string
}

export interface CreateMissionInput extends MissionInput {
  rewardRules: CreateRewardRuleDto[]
}

export interface UpdateMissionInput extends MissionInput {
  id: number
  rewardRules: UpdateRewardRuleDto[]
}
