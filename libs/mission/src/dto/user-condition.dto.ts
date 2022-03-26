import { Expose } from 'class-transformer'

export class UserConditionDto {
  @Expose()
  property: string

  @Expose()
  operator: string

  @Expose()
  value: string

  @Expose()
  type?: string
}
