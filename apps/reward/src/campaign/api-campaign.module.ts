import { Module } from '@nestjs/common'
import { ApiCampaignController } from './api-campaign.controller'
import { CampaignModule } from '@app/campaign'
import { ApiCampaignService } from './api-campaign.service'

@Module({
  imports: [CampaignModule],
  controllers: [ApiCampaignController],
  providers: [ApiCampaignService],
})
export class ApiCampaignModule {}
