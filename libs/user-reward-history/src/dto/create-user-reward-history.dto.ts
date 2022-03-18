import { Expose } from 'class-transformer'

export class CreateUserRewardHistoryDto {
  @Expose({ name: 'campaign_id' })
  campaignId: number

  @Expose({ name: 'mission_id' })
  missionId: number

  @Expose({ name: 'user_id' })
  userId: number

  @Expose({ name: 'user_type' })
  userType: string

  @Expose()
  amount: number

  @Expose()
  currency: string

  @Expose()
  wallet: string
}
