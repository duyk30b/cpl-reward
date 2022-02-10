import { Expose } from 'class-transformer'

export class ConditionDto {
  @Expose()
  name: string

  @Expose()
  operator: string

  @Expose()
  value: string
}
