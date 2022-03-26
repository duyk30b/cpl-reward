import { CreateRewardRuleDto } from '@lib/reward-rule/dto/create-reward-rule.dto'
import { Expose } from 'class-transformer'

export class UpdateRewardRuleDto extends CreateRewardRuleDto {
  @Expose()
  id: number
}
