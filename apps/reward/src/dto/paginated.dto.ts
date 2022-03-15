import { ApiProperty } from '@nestjs/swagger'

class Pagination {
  @ApiProperty({ example: 10 })
  total: number

  @ApiProperty({ example: 20 })
  size: number

  @ApiProperty({ example: 2 })
  page: number

  // @ApiProperty({ name: 'item_count', example: 1 })
  // itemCount: number

  // @ApiProperty({ name: 'total_pages', example: 1 })
  // totalPages: number
}

class Links {
  @ApiProperty({ example: '/xxx?limit=3' })
  first: string
  @ApiProperty({ example: '/xxx?page=1&limit=3' })
  prev: string
  @ApiProperty({ example: '/xxx?page=2&limit=3' })
  next: string
  @ApiProperty({ example: '/xxx?page=4&limit=3' })
  last: string
}

export class PaginatedDto<TData> {
  @ApiProperty()
  pagination: Pagination

  @ApiProperty()
  data: TData[]

  @ApiProperty()
  links: Links
}
