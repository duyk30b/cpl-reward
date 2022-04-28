import { Module } from '@nestjs/common'
import { AdminCampaignController } from './admin-campaign.controller'
import { AdminCampaignService } from './admin-campaign.service'
import { CampaignModule } from '@lib/campaign'
import { RewardRuleModule } from '@lib/reward-rule'
import { CommonModule } from '@lib/common'
import { InternationalPriceModule } from '@lib/international-price'
import { MissionModule } from '@lib/mission'
import { MissionUserLogModule } from '@lib/mission-user-log'
import { UserRewardHistoryModule } from '@lib/user-reward-history'

@Module({
  imports: [
    CampaignModule,
    RewardRuleModule,
    CommonModule,
    InternationalPriceModule,
    MissionModule,
    MissionUserLogModule,
    UserRewardHistoryModule,
  ],
  controllers: [AdminCampaignController],
  providers: [AdminCampaignService],
})
export class AdminCampaignModule {}
