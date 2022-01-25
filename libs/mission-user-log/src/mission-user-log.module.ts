import { Module } from '@nestjs/common'
import { MissionUserLogService } from './mission-user-log.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MissionUserLog } from '@app/mission-user-log/entities/mission-user-log.entity'

@Module({
  imports: [TypeOrmModule.forFeature([MissionUserLog])],
  providers: [MissionUserLogService],
  exports: [MissionUserLogService],
})
export class MissionUserLogModule {}
