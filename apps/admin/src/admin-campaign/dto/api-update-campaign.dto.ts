import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator'
import { ApiUpdateRewardRuleDto } from './api-update-reward-rule.dto'

export class ApiUpdateCampaignDto {
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

  @ApiProperty({ name: 'reward_rules' })
  @Expose({ name: 'reward_rules' })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ApiUpdateRewardRuleDto)
  reward_rules: ApiUpdateRewardRuleDto[]
}
