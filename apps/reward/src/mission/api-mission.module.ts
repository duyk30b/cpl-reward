import { Module } from '@nestjs/common'
import { ApiMissionController } from './api-mission.controller'
import { MissionModule } from '@lib/mission'
import { ApiMissionService } from './api-mission.service'
import { RewardRuleModule } from '@lib/reward-rule'
import { UserRewardHistoryModule } from '@lib/user-reward-history'
import { CommonModule } from '@lib/common'
import { ApiMissionListener } from './listeners/api-mission.listener'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { CampaignModule } from '@lib/campaign'

@Module({
  imports: [
    CampaignModule,
    MissionModule,
    RewardRuleModule,
    UserRewardHistoryModule,
    CommonModule,
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '_',
    }),
  ],
  controllers: [ApiMissionController],
  providers: [ApiMissionService, ApiMissionListener],
})
export class ApiMissionModule {}
