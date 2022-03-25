import { Module } from '@nestjs/common'
import { ApiCampaignService } from './api-campaign.service'
import { ApiCampaignController } from './api-campaign.controller'
import { CampaignModule } from '@lib/campaign'
import { RewardRuleModule } from '@lib/reward-rule'
import { CommonModule } from '@lib/common'

@Module({
  imports: [CampaignModule, RewardRuleModule, CommonModule],
  controllers: [ApiCampaignController],
  providers: [ApiCampaignService],
})
export class ApiCampaignModule {}
