import { Module } from '@nestjs/common'
import { MissionUserService } from './mission-user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MissionUser } from '@lib/mission-user/entities/mission-user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([MissionUser])],
  providers: [MissionUserService],
  exports: [MissionUserService],
})
export class MissionUserModule {}
