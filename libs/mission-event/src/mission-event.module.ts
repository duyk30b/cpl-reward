import { Module } from '@nestjs/common'
import { MissionEventService } from './mission-event.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MissionEvent } from './entities/mission-event.entity'

@Module({
  imports: [TypeOrmModule.forFeature([MissionEvent])],
  providers: [MissionEventService],
  exports: [MissionEventService],
})
export class MissionEventModule {}
