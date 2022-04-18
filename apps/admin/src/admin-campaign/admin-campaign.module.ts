import { Module } from '@nestjs/common'
import { AdminCampaignController } from './admin-campaign.controller'
import { AdminCampaignService } from './admin-campaign.service'
import { CampaignModule } from '@lib/campaign'
import { RewardRuleModule } from '@lib/reward-rule'
import { CommonModule } from '@lib/common'
import { InternationalPriceModule } from '@lib/international-price'

@Module({
  imports: [
    CampaignModule,
    RewardRuleModule,
    CommonModule,
    InternationalPriceModule,
  ],
  controllers: [AdminCampaignController],
  providers: [AdminCampaignService],
})
export class AdminCampaignModule {}
