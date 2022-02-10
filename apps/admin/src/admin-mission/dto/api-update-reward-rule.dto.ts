import { PartialType } from '@nestjs/swagger'
import { ApiCreateRewardRuleDto } from './api-create-reward-rule.dto'

export class ApiUpdateRewardRuleDto extends PartialType(
  ApiCreateRewardRuleDto,
) {}
