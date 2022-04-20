import { Expose } from 'class-transformer'
import { UpdateMissionUserDto } from './update-mission-user.dto'

export class CreateMissionUserDto extends UpdateMissionUserDto {
  @Expose({ name: 'mission_id' })
  missionId: number

  @Expose({ name: 'campaign_id' })
  campaignId: number

  @Expose({ name: 'user_id' })
  userId: string

  @Expose({ name: 'user_type' })
  userType: string
}
