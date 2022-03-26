import { Module } from '@nestjs/common'
import { MissionService } from './mission.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Mission } from '@lib/mission/entities/mission.entity'
import { ConfigModule } from '@nestjs/config'
import configuration from '@lib/mission/configuration'

@Module({
  imports: [
    TypeOrmModule.forFeature([Mission]),
    ConfigModule.forRoot({ load: [configuration] }),
  ],
  providers: [MissionService],
  exports: [MissionService],
})
export class MissionModule {}
