export interface IEventByName {
  msgId: string
  msgName: string
  msgData: any
}

export interface IEvent {
  msgData: any
  missionId: number
  campaignId: number
  msgName: string
  msgId: string
}

export interface IUser {
  id: string
  uuid: string
  email: string
  type: string
  status: string
  referrerCode: string
  referredById: string
  createdAt: string
  updatedAt: string
  bceUpdatedAt: string
  emailVerifyStatus: string
  authenticatorVerifyStatus: string
  kycVerifyStatus: string
  userInfoStatus: string
  accountLv: string
  channelId: number
}

export interface IJudgmentCondition {
  eventName: string
  property: string
  operator: string
  value: string
  type?: string
}

export interface IUserCondition {
  property: string
  operator: string
  value: string
  type?: string
}

export interface IGrantTarget {
  user: string
  amount: string
  currency: string
  wallet: string
  type?: string
}
