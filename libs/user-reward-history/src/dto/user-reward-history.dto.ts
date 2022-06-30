import { USER_REWARD_STATUS } from '../enum'

export interface UserRewardHistoryFilterDto {
  status: USER_REWARD_STATUS
  missionId: number
  userId: string
}
