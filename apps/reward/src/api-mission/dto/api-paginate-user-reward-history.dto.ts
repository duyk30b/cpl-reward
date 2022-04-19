import { Expose } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class ApiPaginateUserRewardHistory {
  @Expose()
  @ApiProperty({ required: false })
  page?: number

  @Expose()
  @ApiProperty({ required: false })
  limit?: number

  @Expose()
  @ApiProperty({ required: false })
  sort?: string

  @Expose({ name: 'sort_type' })
  @ApiProperty({ required: false, name: 'sort_type' })
  sortType?: 'ASC' | 'DESC'
}
