import { PartialType } from '@nestjs/swagger'
import { CreateCampaignDto } from '@app/campaign/dto/create-campaign.dto'
import { Expose } from 'class-transformer'

export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {
  @Expose()
  id: number
}
