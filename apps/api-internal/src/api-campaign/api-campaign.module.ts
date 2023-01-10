import { Module } from '@nestjs/common'
import { ApiCampaignService } from './api-campaign.service'
import { ApiCampaignController } from './api-campaign.controller'
import { CampaignModule } from '@lib/campaign'
import { RewardRuleModule } from '@lib/reward-rule'
import { CommonModule } from '@lib/common'
import { KafkaModule } from '@lib/kafka'
import { MissionModule } from '@lib/mission'
import { UserRewardHistoryModule } from '@lib/user-reward-history'
import { UserCheckinLogModule } from '@libs/user-checkin-log'

@Module({
  imports: [
    CampaignModule,
    RewardRuleModule,
    CommonModule,
    KafkaModule,
    MissionModule,
    UserRewardHistoryModule,
    UserCheckinLogModule,
  ],
  controllers: [ApiCampaignController],
  providers: [ApiCampaignService],
})
export class ApiCampaignModule {}
