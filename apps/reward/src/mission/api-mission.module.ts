import { Module } from '@nestjs/common'
import { ApiMissionController } from './api-mission.controller'
import { MissionModule } from '@lib/mission'
import { ApiMissionService } from './api-mission.service'
import { RewardRuleModule } from '@lib/reward-rule'

@Module({
  imports: [MissionModule, RewardRuleModule],
  controllers: [ApiMissionController],
  providers: [ApiMissionService],
})
export class ApiMissionModule {}
