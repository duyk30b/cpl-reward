import { Expose } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class ApiCreateCampaignDto {
  @ApiProperty()
  @Expose()
  name: string

  @ApiProperty()
  @Expose()
  active: boolean
}
