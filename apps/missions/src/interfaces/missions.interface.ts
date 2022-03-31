export interface IEventByName {
  eventName: string
  messageValueData: any
}

export interface IGiveRewardToUser {
  messageValueData: any
  missionId: number
  campaignId: number
  eventName: string
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
}

export interface JudgmentCondition {
  eventName: string
  property: string
  operator: string
  value: string
  type?: string
}

export interface UserCondition {
  property: string
  operator: string
  value: string
  type?: string
}

export interface Target {
  user: string
  amount: string
  currency: string
  wallet: string
  type?: string
}
