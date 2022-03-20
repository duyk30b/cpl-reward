import { Module } from '@nestjs/common'
import { DemoService } from './demo.service'
import { CampaignModule } from '@lib/campaign'
import { RewardRuleModule } from '@lib/reward-rule'
import { MissionModule } from '@lib/mission'
import { DemoInternalListener } from './demo-internal.listener'
import { CommonService } from '@lib/common'
import { MissionEventModule } from '@lib/mission-event'
import { UserRewardHistoryModule } from '@lib/user-reward-history'
import { MissionsService } from '../missions.service'
import { MissionUserModule } from '@lib/mission-user'

@Module({
  imports: [
    CampaignModule,
    RewardRuleModule,
    MissionModule,
    MissionEventModule,
    UserRewardHistoryModule,
    MissionUserModule,
  ],
  exports: [DemoService],
  providers: [
    DemoService,
    DemoInternalListener,
    MissionsService,
    CommonService,
  ],
})
export class DemoModule {}
