import { Expose } from 'class-transformer'

export class CreateUserRewardHistoryDto {
  @Expose({ name: 'campaign_id' })
  campaignId: number

  @Expose({ name: 'mission_id' })
  missionId: number

  @Expose({ name: 'user_id' })
  userId: string

  @Expose({ name: 'user_type' })
  userType: string

  @Expose()
  amount: string

  @Expose()
  currency: string

  @Expose()
  wallet: string

  @Expose()
  status?: number

  @Expose({ name: 'referrer_user_id' })
  referrerUserId: string
}
