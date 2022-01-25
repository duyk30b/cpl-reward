import { MissionUser } from '@app/mission-user/entities/mission-user.entity'
import { Mission } from '@app/mission/entities/mission.entity'

export default interface BaseMissionService {
  isActiveCampaign(campaign: Mission): Promise<boolean>

  isUserCanJoinCampaign(campaign: Mission, userId: number): Promise<boolean>

  isConquerReward(mission: Mission, missionUser: MissionUser): Promise<boolean>
}
