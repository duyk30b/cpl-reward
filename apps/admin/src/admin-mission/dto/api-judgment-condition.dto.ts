import { Expose } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'

export class ApiJudgmentConditionDto {
  @Expose({ name: 'event_name' })
  @IsNotEmpty()
  @IsString()
  eventName: string

  @Expose()
  @IsNotEmpty()
  @IsString()
  property: string

  @Expose()
  @IsNotEmpty()
  @IsString()
  operator: string

  @Expose()
  @IsNotEmpty()
  @IsString()
  value: string
}
