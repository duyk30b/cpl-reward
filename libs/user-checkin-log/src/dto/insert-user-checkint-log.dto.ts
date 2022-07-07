import { Expose } from 'class-transformer'

export class InsertUserCheckinLogDto {
  @Expose({ name: 'user_id' })
  userId: number

  @Expose({ name: 'campaign_id' })
  campaignId: number

  @Expose({ name: 'last_ignore_display' })
  lastIgnoreDisplay?: number

  @Expose({ name: 'last_checkin' })
  lastCheckin?: number
}
