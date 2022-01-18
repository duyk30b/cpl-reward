import { PartialType } from '@nestjs/swagger'
import { ApiCreateCampaignGroupDto } from './api-create-campaign-group.dto'

export class ApiUpdateCampaignGroupDto extends PartialType(
  ApiCreateCampaignGroupDto,
) {}
