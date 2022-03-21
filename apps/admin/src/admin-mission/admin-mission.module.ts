import { Module } from '@nestjs/common'
import { MissionModule } from '@lib/mission'
import { RewardRuleModule } from '@lib/reward-rule'
import { AdminMissionController } from './admin-mission.controller'
import { AdminMissionService } from './admin-mission.service'
import { MissionEventModule } from '@lib/mission-event'
import { CommonModule } from '@lib/common'

@Module({
  imports: [MissionModule, RewardRuleModule, MissionEventModule, CommonModule],
  controllers: [AdminMissionController],
  providers: [AdminMissionService],
})
export class AdminMissionModule {}
