import { Expose } from 'class-transformer'

export class CreateMissionUserLogDto {
  @Expose({ name: 'campaign_id' })
  campaignId: number

  @Expose({ name: 'mission_id' })
  missionId: number

  @Expose({ name: 'user_id' })
  userId: string

  @Expose({ name: 'success_count' })
  successCount: number

  @Expose({ name: 'money_earned' })
  moneyEarned: number

  @Expose()
  note: string

  @Expose({ name: 'user_type' })
  userType: string

  @Expose()
  currency: string
}
