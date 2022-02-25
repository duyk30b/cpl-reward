import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class ApiCampaignDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  title: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiProperty({ name: 'detail_explain' })
  @Expose({ name: 'detail_explain' })
  @IsNotEmpty()
  @IsString()
  detailExplain: string

  @ApiProperty({ name: 'start_date' })
  @Expose({ name: 'start_date' })
  @IsNotEmpty()
  @IsNumber()
  startDate: number

  @ApiProperty({ name: 'end_date' })
  @Expose({ name: 'end_date' })
  @IsNotEmpty()
  @IsNumber()
  endDate: number

  @ApiProperty({ name: 'notification_link' })
  @Expose({ name: 'notification_link' })
  @IsNotEmpty()
  @IsString()
  notificationLink: string

  @ApiProperty({ name: 'campaign_image' })
  @Expose({ name: 'campaign_image' })
  @IsNotEmpty()
  @IsString()
  campaignImage: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  priority: number

  @ApiProperty({ name: 'is_system' })
  @Expose({ name: 'is_system' })
  @IsNotEmpty()
  @IsBoolean()
  isSystem: boolean
}
