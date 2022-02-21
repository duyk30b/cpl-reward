import { Expose, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator'
import { ApiMissionDto } from './api-mission.dto'
import { ApiUpdateRewardRuleDto } from '../../admin-reward-rule/dto/api-update-reward-rule.dto'

export class ApiUpdateMissionDto extends ApiMissionDto {
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
