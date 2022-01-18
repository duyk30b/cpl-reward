import { Module } from '@nestjs/common'
import { ApiCampaignGroupService } from './api-campaign-group.service'
import { ApiCampaignGroupController } from './api-campaign-group.controller'
import { CampaignGroupModule } from '@app/campaign-group'
import { CampaignModule } from '@app/campaign'
import { CampaignGroupMapModule } from '@app/campaign-group-map'

@Module({
  imports: [CampaignGroupModule, CampaignModule, CampaignGroupMapModule],
  controllers: [ApiCampaignGroupController],
  providers: [ApiCampaignGroupService],
})
export class ApiCampaignGroupModule {}
