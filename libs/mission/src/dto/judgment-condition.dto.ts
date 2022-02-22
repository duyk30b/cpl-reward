import { Expose } from 'class-transformer'

export class JudgmentConditionDto {
  @Expose({ name: 'event_name' })
  eventName: string

  @Expose()
  property: string

  @Expose()
  operator: string

  @Expose()
  value: string
}
