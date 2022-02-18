import { PartialType } from '@nestjs/swagger'
import { CreateCampaignDto } from '@lib/campaign/dto/create-campaign.dto'
import { Expose } from 'class-transformer'

export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {
  @Expose()
  id: number
}
