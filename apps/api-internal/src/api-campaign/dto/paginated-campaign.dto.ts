import { ApiProperty } from '@nestjs/swagger'

export class PaginatedCampaignDto {
  @ApiProperty({ example: 1 })
  id: number

  @ApiProperty()
  title: string

  @ApiProperty({ name: 'title_ja' })
  titleJa: string

  @ApiProperty()
  description: string

  @ApiProperty({ name: 'description_ja' })
  descriptionJa: string

  @ApiProperty({ name: 'notification_link' })
  notificationLink: string

  @ApiProperty({ name: 'notification_link_ja' })
  notificationLinkJa: string

  @ApiProperty({ name: 'campaign_image' })
  campaignImage: string

  @ApiProperty({ name: 'campaign_image_ja' })
  campaignImageJa: string

  @ApiProperty({ name: 'start_date', example: 1651462800 })
  startDate: number

  @ApiProperty({ name: 'end_date', example: 1652499600 })
  endDate: number

  @ApiProperty({ example: 1 })
  status: number
}
