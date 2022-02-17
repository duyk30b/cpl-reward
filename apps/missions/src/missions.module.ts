import { Module } from '@nestjs/common'
import { KafkaModule } from '@app/kafka'
import { CommonModule } from '@app/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { MysqlModule } from '@app/mysql'
import { MissionsController } from './missions.controller'
import { DemoModule } from './demo/demo.module';

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
  ],
  providers: [],
})
export class MissionsModule {}
