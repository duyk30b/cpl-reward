import { PartialType } from '@nestjs/swagger'
import { ApiCreateRewardRuleDto } from './api-create-reward-rule.dto'
import { Expose } from 'class-transformer'

export class ApiUpdateRewardRuleDto extends PartialType(
  ApiCreateRewardRuleDto,
) {
  @Expose()
  id: string
}
