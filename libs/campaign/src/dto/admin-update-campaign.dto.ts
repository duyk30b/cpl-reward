import { PartialType } from '@nestjs/swagger'
import { CreateCampaignDto } from './create-campaign.dto'
import { Expose } from 'class-transformer'

export class AdminUpdateCampaignDto extends PartialType(CreateCampaignDto) {
  @Expose()
  id: number
}
