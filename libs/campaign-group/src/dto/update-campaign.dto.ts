import { PartialType } from '@nestjs/swagger'
import { CreateCampaignGroupDto } from '@app/campaign-group/dto/create-campaign-group.dto'
import { Expose } from 'class-transformer'

export class UpdateCampaignGroupDto extends PartialType(
  CreateCampaignGroupDto,
) {
  @Expose()
  id: number
}
