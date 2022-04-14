import { IEvent, IGrantTarget } from './missions.interface'

export interface IUpdateMissionUser {
  userId: string
  limitReceivedReward: number
  // userType: string
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
}
