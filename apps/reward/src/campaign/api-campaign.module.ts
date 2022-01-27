import { Module } from '@nestjs/common'
import { ApiCampaignService } from './api-campaign.service'
import { ApiCampaignController } from './api-campaign.controller'
import { CampaignModule } from '@app/campaign'
import { MissionModule } from '@app/mission'

@Module({
  imports: [CampaignModule, MissionModule],
  controllers: [ApiCampaignController],
  providers: [ApiCampaignService],
})
export class ApiCampaignModule {}
