import { Module } from '@nestjs/common'
import { ApiMissionController } from './api-mission.controller'
import { MissionModule } from '@lib/mission'
import { ApiMissionService } from './api-mission.service'
import { RewardRuleModule } from '@lib/reward-rule'
import { UserRewardHistoryModule } from '@lib/user-reward-history'
import { CommonModule } from '@lib/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { CampaignModule } from '@lib/campaign'
import { ExternalUserModule } from '@lib/external-user'

@Module({
  imports: [
    CampaignModule,
    MissionModule,
    RewardRuleModule,
    UserRewardHistoryModule,
    ExternalUserModule,
    CommonModule,
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '_',
    }),
  ],
  controllers: [ApiMissionController],
  providers: [ApiMissionService],
})
export class ApiMissionModule {}
