import { PartialType } from '@nestjs/swagger'
import { CreateCampaignDto } from '@app/campaign/dto/create-campaign.dto'

export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {}
