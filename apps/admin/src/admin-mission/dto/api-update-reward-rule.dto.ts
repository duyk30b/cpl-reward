import { Expose } from 'class-transformer'
import { IsNotEmpty, IsNumber } from 'class-validator'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { ApiCreateRewardRuleDto } from './api-create-reward-rule.dto'

export class ApiUpdateRewardRuleDto extends PartialType(
  ApiCreateRewardRuleDto,
) {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  id: number
}
