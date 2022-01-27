import { Controller } from '@nestjs/common'
import { ApiCampaignService } from './api-campaign.service'

@Controller('campaigns')
export class ApiCampaignController {
  constructor(private readonly apiCampaignService: ApiCampaignService) {}
}
