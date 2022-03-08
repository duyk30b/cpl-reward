import { ApiProperty } from '@nestjs/swagger'

export class PaginatedCampaignDto {
  @ApiProperty({ example: 1 })
  id: number

  @ApiProperty({ example: 'This is campaign title' })
  title: string
}
