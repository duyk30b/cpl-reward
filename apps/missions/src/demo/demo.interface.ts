export interface UserById {
  id: string
}
export interface SendRewardToBalanceInput {
  userId: number
  currency: string
  amount: number
  type: string
  campaignId: number
  missionId: number
}
