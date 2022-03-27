import { ApiProperty } from '@nestjs/swagger'

export class PaginatedCampaignDto {
  @ApiProperty({ example: 1 })
  id: number

  @ApiProperty()
  title: string

  @ApiProperty()
  description: string

  @ApiProperty({ name: 'detail_explain' })
  detailExplain: string

  @ApiProperty({ name: 'notification_link' })
  notificationLink: string

  @ApiProperty({ name: 'campaign_image' })
  campaignImage: string

  @ApiProperty({ name: 'title_jp' })
  titleJp: string

  @ApiProperty({ name: 'description_jp' })
  descriptionJp: string

  @ApiProperty({ name: 'notification_link_jp' })
  notificationLinkJp: string

  @ApiProperty({ name: 'image_link_jp' })
  imageLinkJp: string

  @ApiProperty({ name: 'start_date' })
  startDate: string

  @ApiProperty({ name: 'end_date' })
  endDate: string
}
