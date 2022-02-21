import { Expose, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator'
import { ApiUpdateRewardRuleDto } from '../../admin-reward-rule/dto/api-update-reward-rule.dto'
import { ApiCampaignDto } from './api-campaign.dto'

export class ApiUpdateCampaignDto extends ApiCampaignDto {
  @Expose()
  id: number

  @ApiProperty({ name: 'reward_rules' })
  @Expose({ name: 'reward_rules' })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ApiUpdateRewardRuleDto)
  rewardRules: ApiUpdateRewardRuleDto[]
}
