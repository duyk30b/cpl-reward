import { Module } from '@nestjs/common'
import { AdminCampaignController } from './admin-campaign.controller'
import { AdminCampaignService } from './admin-campaign.service'
import { CampaignModule } from '@app/campaign'
import { RewardRuleModule } from '@app/reward-rule'

@Module({
  imports: [CampaignModule, RewardRuleModule],
  controllers: [AdminCampaignController],
  providers: [AdminCampaignService],
})
export class AdminCampaignModule {}
