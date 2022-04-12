import { ReferredUserInfoDto } from '@lib/mission-user/dto/referred-user-info.dto'

export interface IUpdateMissionUser {
  userId: string
  missionId: number
  referredUserInfo: ReferredUserInfoDto
  eventName: string
  moneyEarned: string
  limitReceivedReward: number
}

export interface ICreateMissionUserLog {
  userId: string
  missionId: number
  successCount: number
  moneyEarned: string
  totalMoneyEarned: string
  referredUserInfo: ReferredUserInfoDto
  note: string
}

export interface IUpdateValueRewardCampaign {
  campaignId: number
  amount: string
}
