import { Module } from '@nestjs/common'
import { AdminCampaignController } from './admin-campaign.controller'
import { AdminCampaignService } from './admin-campaign.service'
import { CampaignModule } from '@lib/campaign'
import { RewardRuleModule } from '@lib/reward-rule'
import { CommonModule } from '@lib/common'

@Module({
  imports: [CampaignModule, RewardRuleModule, CommonModule],
  controllers: [AdminCampaignController],
  providers: [AdminCampaignService],
})
export class AdminCampaignModule {}
