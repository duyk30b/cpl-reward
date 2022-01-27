import { Expose } from 'class-transformer'

export class CreateCampaignDto {
  @Expose()
  id: number

  @Expose()
  title: string

  @Expose()
  description: string

  @Expose()
  detailExplain: string

  @Expose()
  startDate: number

  @Expose()
  endDate: number

  @Expose()
  notificationLink: string

  @Expose()
  campaignImage: string
}
