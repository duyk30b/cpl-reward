import { Expose, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator'
import { ApiCreateRewardRuleDto } from './api-create-reward-rule.dto'
import { ApiTargetDto } from './api-target.dto'
import { ApiUserConditionDto } from './api-user-condition.dto'
import { ApiJudgmentConditionDto } from './api-judgment-condition.dto'

export class ApiCreateMissionDto {
  @Expose({ name: 'campaign_id' })
  @ApiProperty({ name: 'campaign_id' })
  campaignId: number

  @Expose()
  @ApiProperty()
  title: string

  @Expose({ name: 'detail_explain' })
  @ApiProperty({ name: 'detail_explain' })
  detailExplain: string

  @Expose({ name: 'opening_date' })
  @ApiProperty({ name: 'opening_date' })
  openingDate: number

  @Expose({ name: 'closing_date' })
  @ApiProperty({ name: 'closing_date' })
  closingDate: number

  @ApiProperty({ name: 'reward_rules' })
  @Expose({ name: 'reward_rules' })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ApiCreateRewardRuleDto)
  rewardRules: ApiCreateRewardRuleDto[]

  @Expose({ name: 'judgment_conditions' })
  @ApiProperty({ name: 'judgment_conditions' })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ApiJudgmentConditionDto)
  judgmentConditions: ApiJudgmentConditionDto[]

  @Expose({ name: 'user_conditions' })
  @ApiProperty({ name: 'user_conditions' })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ApiUserConditionDto)
  userConditions: ApiUserConditionDto[]

  @Expose({ name: 'grant_target' })
  @ApiProperty({ name: 'grant_target' })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ApiTargetDto)
  grantTarget: ApiTargetDto[]
}
