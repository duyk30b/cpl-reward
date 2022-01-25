import { Module } from '@nestjs/common'
import { KafkaModule } from '@app/kafka'
import { CommonModule } from '@app/common'
import { C01Module } from './c01/c01.module'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { MysqlModule } from '@app/mysql'
import { MissionsController } from './campaigns.controller'

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
    C01Module,
  ],
  providers: [],
})
export class MissionsModule {}
