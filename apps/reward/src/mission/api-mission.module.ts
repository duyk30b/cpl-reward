import { Module } from '@nestjs/common'
import { ApiMissionController } from './api-mission.controller'
import { MissionModule } from '@app/mission'
import { ApiMissionService } from './api-mission.service'

@Module({
  imports: [MissionModule],
  controllers: [ApiMissionController],
  providers: [ApiMissionService],
})
export class ApiMissionModule {}
