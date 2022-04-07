import { Expose, Type, Transform, plainToInstance } from 'class-transformer'

export class ListEventsDto {
  @Expose()
  @Type(() => EventDto)
  events: EventDto[]
}

export class EventDto {
  @Expose()
  eventName: string

  @Expose()
  @Type(() => EventPropertyDto)
  properties: EventPropertyDto[]
}

export class EventPropertyDto {
  @Expose()
  key: string

  @Expose()
  type: string

  @Expose()
  display: string

  @Expose()
  description: string

  @Expose()
  @Transform(({ value }) => JSON.stringify(value), { toClassOnly: true })
  options: string
}

export class UserConditionPropertyDto {
  @Expose()
  type: string

  @Expose()
  display: string

  @Expose()
  @Transform(({ value }) => JSON.stringify(value), { toClassOnly: true })
  options: string
}

export class UserConditionListDto {
  @Expose()
  @Transform(
    ({ value }) => {
      const newValue = {}

      for (const entry of Object.entries(value)) {
        newValue[entry[0]] = plainToInstance(UserConditionPropertyDto, entry[1])
      }

      return newValue
    },
    { toClassOnly: true },
  )
  list: {
    [key: string]: UserConditionPropertyDto
  }
}
