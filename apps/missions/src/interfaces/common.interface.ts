import { ReferredUserInfoDto } from '@lib/mission-user/dto/referred-user-info.dto'

export interface UpdateMissionUser {
  userId: number
  missionId: number
  referredUserInfo: ReferredUserInfoDto
  eventName: string
  moneyEarned: string
}
