import { Module } from '@nestjs/common'
import { MissionModule } from '@app/mission'
import { RewardRuleModule } from '@app/reward-rule'
import { AdminMissionController } from './admin-mission.controller'
import { AdminMissionService } from './admin-mission.service'

@Module({
  imports: [MissionModule, RewardRuleModule],
  controllers: [AdminMissionController],
  providers: [AdminMissionService],
})
export class AdminMissionModule {}
