export interface ISendRewardToBalance {
  id: number
  userId: number
  currency: string
  amount: number
  type: string
  eventName: string
}

export interface ISendRewardToCashback {
  id: number
  userId: number
  currency: string
  amount: string
  historyId: number
  eventName: string
}
