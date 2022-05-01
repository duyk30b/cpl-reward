import { IEvent } from './missions.interface'

export class SendRewardToBalance {
  id: number
  userId: string
  currency: string
  amount: string
  type: string
  data: IEvent
  userType: string
  referenceId: string
}

export class SendRewardToCashback {
  id: number
  userId: string
  currency: string
  amount: string
  historyId: number
  data: IEvent
  userType: string
  referenceId: string
}
