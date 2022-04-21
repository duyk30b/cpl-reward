import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TerminusModule } from '@nestjs/terminus'
import db from 'config/db'
import { HealthController } from './health.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [db],
    }),
    TerminusModule,
  ],
  controllers: [HealthController],
})
export class HealthModule {}
