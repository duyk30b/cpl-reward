import { Expose } from 'class-transformer'

export class CreateCampaignDto {
  @Expose()
  title: string

  @Expose()
  description: string

  @Expose({ name: 'detail_explain' })
  detailExplain: string

  @Expose({ name: 'start_date' })
  startDate: number

  @Expose({ name: 'end_date' })
  endDate: number

  @Expose({ name: 'notification_link' })
  notificationLink: string

  @Expose({ name: 'campaign_image' })
  campaignImage: string

  @Expose()
  priority?: number

  @Expose({ name: 'is_system' })
  isSystem?: boolean

  @Expose()
  status?: number

  @Expose({ name: 'is_active' })
  isActive?: number
}
