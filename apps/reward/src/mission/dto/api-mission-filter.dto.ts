import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class ApiMissionFilterDto {
  @ApiProperty({ name: 'campaign_id', required: true, example: 1 })
  @Expose({ name: 'campaign_id' })
  campaignId: number

  @ApiProperty({ required: false, example: 1 })
  @Expose()
  page: number

  @ApiProperty({ required: false, example: 20 })
  @Expose()
  limit: number

  @ApiProperty({ name: 'search_field', required: false })
  @Expose({ name: 'search_field' })
  searchField: string

  @ApiProperty({ name: 'search_text', required: false })
  @Expose({ name: 'search_text' })
  searchText: string

  @ApiProperty({ required: false })
  @Expose()
  sort: string

  @ApiProperty({ name: 'sort_type', required: false, enum: ['ASC', 'DESC'] })
  @Expose({ name: 'sort_type' })
  sortType: 'ASC' | 'DESC'
}
