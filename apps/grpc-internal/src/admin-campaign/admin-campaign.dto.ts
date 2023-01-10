import { Expose } from 'class-transformer'

export class MissingRewardsFilterDto {
  page: number
  limit: number
  sort: string
  sortType: 'ASC' | 'DESC'
}

export class UpdateRewardLogDto {
  @Expose()
  id: number

  @Expose()
  status: number
}

export class FilterCountRewardLogDto {
  @Expose()
  status: number

  @Expose()
  fromTime?: number

  @Expose()
  toTime?: number
}
