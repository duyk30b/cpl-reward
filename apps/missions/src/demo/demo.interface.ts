export interface UserById {
  id: string
}
export interface SendRewardToBalanceInput {
  currency: string
  amount: string
  type: string
  campaignId: number
  missionId: number
}
