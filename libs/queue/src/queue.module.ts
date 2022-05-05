import { Module } from '@nestjs/common'
import { QueueService } from './queue.service'
import { BullModule } from '@nestjs/bull'
import { ConfigModule } from '@nestjs/config'
import redisConfig from '../../../config/redis'
import { WorkerBullOptions } from '@lib/queue/options/worker-bull-options.factory'
import { LoggerBullOptions } from '@lib/queue/options/logger-bull-options.factory'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [redisConfig],
    }),
    BullModule.registerQueueAsync({
      name: 'worker',
      useClass: WorkerBullOptions,
    }),
    BullModule.registerQueueAsync({
      name: 'logger',
      useClass: LoggerBullOptions,
    }),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
