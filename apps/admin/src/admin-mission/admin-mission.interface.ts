export interface CreateInput {
  campaignId: number
  title: string
  detailExplain: string
  openingDate: number
  closingDate: number
  rewardRules: CreateRewardRule[]
  judgmentConditions: Condition[]
  userConditions: Condition[]
  grantTarget: GrantTarget[]
}

interface CreateRewardRule {
  key: string
  currency: string
  limitValue: number
}
interface Condition {
  name: string
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
  judgmentConditions: Condition[]
  userConditions: Condition[]
  grantTarget: GrantTarget[]
}
interface UpdateRewardRule {
  id: number
  key: string
  currency: string
  limitValue: number
}
