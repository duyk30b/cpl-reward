export interface CancelInput {
  campaignId: number
}

export interface FindOneInput {
  id: number
}

export interface UpdateInput {
  id: number
  title: string
  description: string
  detailExplain: string
  startDate: number
  endDate: number
  notificationLink: string
  campaignImage: string
  rewardRules: RewardRule[]
}

interface RewardRule {
  id: number
  key: string
  currency: string
  limitValue: number
}
