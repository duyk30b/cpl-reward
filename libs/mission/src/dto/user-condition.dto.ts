import { Expose } from 'class-transformer'

export class UserConditionDto {
  @Expose()
  name: string

  @Expose()
  operator: string

  @Expose()
  value: string
}
