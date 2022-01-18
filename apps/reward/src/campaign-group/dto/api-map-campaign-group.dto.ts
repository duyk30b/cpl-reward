import { Expose } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class ApiMapCampaignGroupDto {
  @ApiProperty()
  @Expose()
  id: number

  @ApiProperty({ name: 'campaign_ids' })
  @Expose({ name: 'campaign_ids' })
  campaignIds: [number]
}
