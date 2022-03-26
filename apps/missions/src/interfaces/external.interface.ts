export interface ISendRewardToBalance {
  id: number
  userId: number
  currency: string
  amount: number
  type: string
}

export interface ISendRewardToCashback {
  id: number
  userId: number
  currency: string
  amount: string
  historyId: number
}
