import { Module } from '@nestjs/common'
import { ApiCampaignService } from './api-campaign.service'
import { ApiCampaignController } from './api-campaign.controller'
import { CampaignModule } from '@app/campaign'
import { RewardRuleModule } from '@app/reward-rule'

@Module({
  imports: [CampaignModule, RewardRuleModule],
  controllers: [ApiCampaignController],
  providers: [ApiCampaignService],
})
export class ApiCampaignModule {}
