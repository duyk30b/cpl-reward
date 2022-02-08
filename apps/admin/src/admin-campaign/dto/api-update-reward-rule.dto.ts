import { Expose } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class ApiUpdateRewardRuleDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  key: string

  @Expose()
  @IsNotEmpty()
  @IsString()
  currency: string

  @Expose({ name: 'limit_value' })
  @IsNotEmpty()
  @IsNumber()
  limitValue: number
}
