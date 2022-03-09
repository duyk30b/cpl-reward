import { ApiProperty } from '@nestjs/swagger'

class Pagination {
  @ApiProperty({ name: 'total_items', example: 1 })
  totalItems: number

  @ApiProperty({ name: 'item_count', example: 1 })
  itemCount: number

  @ApiProperty({ name: 'items_per_page', example: 20 })
  itemsPerPage: number

  @ApiProperty({ name: 'total_pages', example: 1 })
  totalPages: number

  @ApiProperty({ name: 'current_page', example: 1 })
  currentPage: number
}

export class PaginatedDto<TData> {
  @ApiProperty()
  pagination: Pagination

  @ApiProperty()
  data: TData[]
}
