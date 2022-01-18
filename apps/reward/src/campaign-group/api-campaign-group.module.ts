import { Module } from '@nestjs/common'
import { ApiCampaignGroupService } from './api-campaign-group.service'
import { ApiCampaignGroupController } from './api-campaign-group.controller'
import { CampaignGroupModule } from '@app/campaign-group'
import { CampaignModule } from '@app/campaign'

@Module({
  imports: [CampaignGroupModule, CampaignModule],
  controllers: [ApiCampaignGroupController],
  providers: [ApiCampaignGroupService],
})
export class ApiCampaignGroupModule {}
