import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { TerminusModule } from '@nestjs/terminus'
import { HealthService } from './health.service'

@Module({
  imports: [TerminusModule, ConfigModule, ScheduleModule.forRoot()],
  providers: [HealthService],
})
export class HealthModule {}
