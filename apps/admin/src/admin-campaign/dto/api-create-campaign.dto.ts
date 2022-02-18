import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator'
import { ApiCreateRewardRuleDto } from '../../admin-reward-rule/dto/api-create-reward-rule.dto'
import { ApiCampaignDto } from './api-campaign.dto'

export class ApiCreateCampaignDto extends ApiCampaignDto {
  @ApiProperty({ name: 'reward_rules' })
  @Expose({ name: 'reward_rules' })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ApiCreateRewardRuleDto)
  rewardRules: ApiCreateRewardRuleDto[]
}
