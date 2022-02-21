import { Module } from '@nestjs/common'
import { KafkaModule } from '@lib/kafka'
import { CommonModule } from '@lib/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { MysqlModule } from '@lib/mysql'
import { MissionsController } from './missions.controller'
import { DemoModule } from './demo/demo.module'
import { ConfigModule } from '@nestjs/config'
import { ExternalUserModule } from '@lib/external-user'

@Module({
  controllers: [MissionsController],
  imports: [
    MysqlModule,
    CommonModule,
    KafkaModule,
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '_',
    }),
    DemoModule,
    ConfigModule,
    ExternalUserModule,
  ],
})
export class MissionsModule {}
