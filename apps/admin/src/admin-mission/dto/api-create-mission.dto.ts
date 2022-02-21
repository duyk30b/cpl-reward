import { Expose, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator'
import { ApiMissionDto } from './api-mission.dto'
import { ApiCreateRewardRuleDto } from '../../admin-reward-rule/dto/api-create-reward-rule.dto'

export class ApiCreateMissionDto extends ApiMissionDto {
  @ApiProperty({ name: 'reward_rules' })
  @Expose({ name: 'reward_rules' })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ApiCreateRewardRuleDto)
  rewardRules: ApiCreateRewardRuleDto[]
}
