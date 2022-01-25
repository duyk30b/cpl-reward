import { Module } from '@nestjs/common'
import { MissionService } from './mission.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Mission } from '@app/mission/entities/mission.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Mission])],
  providers: [MissionService],
  exports: [MissionService],
})
export class MissionModule {}
