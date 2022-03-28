import { Expose } from 'class-transformer'

export class CreateCampaignDto {
  @Expose()
  title: string

  @Expose({ name: 'title_jp' })
  titleJp: string

  @Expose()
  description: string

  @Expose({ name: 'description_jp' })
  descriptionJp: string

  // @Expose({ name: 'detail_explain' })
  // detailExplain: string
  //
  // @Expose({ name: 'detail_explain_jp' })
  // detailExplainJp: string

  @Expose({ name: 'start_date' })
  startDate: number

  @Expose({ name: 'end_date' })
  endDate: number

  @Expose({ name: 'notification_link' })
  notificationLink: string

  @Expose({ name: 'notification_link_jp' })
  notificationLinkJp: string

  @Expose({ name: 'campaign_image' })
  campaignImage: string

  @Expose({ name: 'campaign_image_jp' })
  campaignImageJp: string

  @Expose()
  priority?: number

  @Expose({ name: 'is_system' })
  isSystem?: boolean

  @Expose()
  status?: number

  @Expose({ name: 'is_active' })
  isActive?: number
}
