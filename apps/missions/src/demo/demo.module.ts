import { Module } from '@nestjs/common'
import { DemoService } from './demo.service'
import { CampaignModule } from '@lib/campaign'
import { RewardRuleModule } from '@lib/reward-rule'
import { MissionModule } from '@lib/mission'
import { DemoInternalListener } from './demo-internal.listener'
import { CommonModule } from '@lib/common'
import { MissionEventModule } from '@lib/mission-event'
import { UserRewardHistoryModule } from '@lib/user-reward-history'

@Module({
  imports: [
    CampaignModule,
    RewardRuleModule,
    MissionModule,
    CommonModule,
    MissionEventModule,
    UserRewardHistoryModule,
  ],
  exports: [DemoService],
  providers: [DemoService, DemoInternalListener],
})
export class DemoModule {}
