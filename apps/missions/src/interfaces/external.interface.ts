import { IEvent } from './missions.interface'

export interface ISendRewardToBalance {
  id: number
  userId: string
  currency: string
  amount: string
  type: string
  data: IEvent
  userType: string
  referenceId: string
}

export interface ISendRewardToCashback {
  id: number
  userId: string
  currency: string
  amount: string
  historyId: number
  data: IEvent
  userType: string
  referenceId: string
}
