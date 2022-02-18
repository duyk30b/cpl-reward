import { Module } from '@nestjs/common'
import { DemoService } from './demo.service'
import { CampaignModule } from '@lib/campaign'
import { RewardRuleModule } from '@lib/reward-rule'
import { MissionModule } from '@lib/mission'
import { DemoInternalListener } from './demo-internal.listener'
import { DemoLocalListener } from './demo-local.listener'
import { ExternalBalanceModule } from '@lib/external-balance'
import { MissionUserLogModule } from '@lib/mission-user-log'
import { CommonModule } from '@lib/common'

@Module({
  imports: [
    CampaignModule,
    RewardRuleModule,
    MissionModule,
    ExternalBalanceModule,
    MissionUserLogModule,
    CommonModule,
  ],
  providers: [DemoService, DemoInternalListener, DemoLocalListener],
})
export class DemoModule {}
