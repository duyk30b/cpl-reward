import { ReferredUserInfoDto } from '@lib/mission-user/dto/referred-user-info.dto'

export interface SendRewardToBalanceInput {
  id: number
  userId: number
  currency: string
  amount: number
  type: string
}

export interface SendRewardToCashbackInput {
  id: number
  userId: number
  currency: string
  amount: string
}

export interface AuthUserLoginInput {
  userId: number
  referredById: number
  missionId: number
  campaignId: number
  user: IUser
  messageValue: any
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
}

export interface UserCondition {
  property: string
  operator: string
  value: string
}

export interface Target {
  user: string
  amount: number
  currency: string
  wallet: string
  type?: string
}

export interface UpdateMissionUser {
  userId: number
  missionId: number
  referredUserInfo: ReferredUserInfoDto
  eventName: string
  moneyEarned: number
}
