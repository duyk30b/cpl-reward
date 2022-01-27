import { Expose } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'

export class ApiConditionDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  name: string

  @Expose()
  @IsNotEmpty()
  @IsString()
  operator: string

  @Expose()
  @IsNotEmpty()
  @IsString()
  value: string
}
