import { Expose } from 'class-transformer'

export class FilterUserCheckinLogDto {
  @Expose({ name: 'user_id' })
  userId: number

  @Expose({ name: 'campaign_id' })
  campaignId: number
}
