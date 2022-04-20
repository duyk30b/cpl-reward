import { IEvent } from './missions.interface'
import { IGrantTarget } from '@lib/common/common.interface'

export interface IUpdateMissionUser {
  userId: string
  limitReceivedReward: number
  userType: string
  userTarget: IGrantTarget
  data: IEvent
}

export interface ICreateMissionUserLog {
  userId: string
  missionId: number
  successCount: number
  moneyEarned: string
  note: string
  userType: string
}

export interface IUpdateValueRewardCampaign {
  campaignId: number
  amount: string
  key: string // Cột này đáng lẽ đổi tên thành wallet
  currency: string
}
