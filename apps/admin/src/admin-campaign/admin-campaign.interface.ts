export interface CancelInput {
  campaignId: number
}

export interface FindOneInput {
  id: number
}

export interface CreateInput {
  title: string
  description: string
  detailExplain: string
  startDate: number
  endDate: number
  notificationLink: string
  campaignImage: string
  rewardRules: RewardRule[]
}

export interface UpdateInput extends CreateInput {
  id: number
}

interface RewardRule {
  id: number
  key: string
  currency: string
  limitValue: number
}
