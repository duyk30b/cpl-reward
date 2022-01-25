import { MissionUser } from '@app/mission-user/entities/mission-user.entity'

export class EventMissionUserLog {
  name: string
  isNewUser = false
  isGiveRewardSuccess = false
  missionUser: MissionUser
  extraData: any
}
