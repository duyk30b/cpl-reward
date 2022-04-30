import { Module } from '@nestjs/common'
import { QueueService } from './queue.service'
import { BullModule } from '@nestjs/bull'
import { BullOptionsFactory } from './bull-options.factory'
import { ConfigModule } from '@nestjs/config'
import configuration from './configuration'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    BullModule.registerQueueAsync({
      name: 'queue',
      useClass: BullOptionsFactory,
    }),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
