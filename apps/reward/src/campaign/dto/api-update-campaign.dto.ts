import { PartialType } from '@nestjs/swagger'
import { ApiCreateCampaignDto } from './api-create-campaign.dto'

export class ApiUpdateCampaignDto extends PartialType(ApiCreateCampaignDto) {}
