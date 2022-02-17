export interface CreateInput {
  campaignId: number
  title: string
  detailExplain: string
  openingDate: number
  closingDate: number
  rewardRules: CreateRewardRule[]
  judgmentConditions: JudgmentCondition[]
  userConditions: UserCondition[]
  grantTarget: GrantTarget[]
}

interface CreateRewardRule {
  key: string
  currency: string
  limitValue: number
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
interface GrantTarget {
  user: string
  amount: number
  currency: string
  wallet: string
}
export interface UpdateInput {
  id: number
  campaignId: number
  title: string
  detailExplain: string
  openingDate: number
  closingDate: number
  rewardRules: UpdateRewardRule[]
  judgmentConditions: JudgmentCondition[]
  userConditions: UserCondition[]
  grantTarget: GrantTarget[]
}
interface UpdateRewardRule {
  id: number
  key: string
  currency: string
  limitValue: number
}
