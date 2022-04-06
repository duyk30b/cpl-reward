export interface ISendRewardToBalance {
  id: number
  userId: string
  currency: string
  amount: number
  type: string
  eventName: string
}

export interface ISendRewardToCashback {
  id: number
  userId: string
  currency: string
  amount: string
  historyId: number
  eventName: string
}
