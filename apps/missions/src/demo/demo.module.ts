import { Module } from '@nestjs/common'
import { DemoService } from './demo.service'
import { CampaignModule } from '@app/campaign'
import { RewardRuleModule } from '@app/reward-rule'
import { MissionModule } from '@app/mission'
import { DemoInternalListener } from './demo-internal.listener'
import { DemoLocalListener } from './demo-local.listener'

@Module({
  imports: [CampaignModule, RewardRuleModule, MissionModule],
  providers: [DemoService, DemoInternalListener, DemoLocalListener],
})
export class DemoModule {}
