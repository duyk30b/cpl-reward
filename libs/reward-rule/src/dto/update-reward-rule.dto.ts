import { PartialType } from '@nestjs/swagger'
import { CreateRewardRuleDto } from '@lib/reward-rule/dto/create-reward-rule.dto'
import { Expose } from 'class-transformer'

export class UpdateRewardRuleDto extends PartialType(CreateRewardRuleDto) {
  @Expose()
  id: number
}
