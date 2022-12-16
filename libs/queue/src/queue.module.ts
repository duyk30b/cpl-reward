import { Module } from '@nestjs/common'
import { QueueService } from './queue.service'
import { BullModule } from '@nestjs/bull'
import { ConfigModule } from '@nestjs/config'
import redisConfig from '../../../config/redis'
import { WorkerBullOptions } from '@lib/queue/options/worker-bull-options.factory'
import { LoggerBullOptions } from '@lib/queue/options/logger-bull-options.factory'
import { BalanceBullOptions } from '@lib/queue/options/balance-bull-options.factory'
import { CashbackBullOptions } from '@lib/queue/options/cashback-bull-options.factory'
import { EventHandlerBullOptions } from '@lib/queue/options/event-handler-bull-options.factory'
import { SendRewardBullOptions } from '@lib/queue/options/send-reward-bull-options.factory'
import { QUEUE_NAME_SEND_REWARD } from '@lib/queue/constant'

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
    BullModule.registerQueueAsync({
      name: 'banker_balance',
      useClass: BalanceBullOptions,
    }),
    BullModule.registerQueueAsync({
      name: 'banker_cashback',
      useClass: CashbackBullOptions,
    }),
    BullModule.registerQueueAsync({
      name: 'event_handler',
      useClass: EventHandlerBullOptions,
    }),
    BullModule.registerQueueAsync({
      name: QUEUE_NAME_SEND_REWARD,
      useClass: SendRewardBullOptions,
    }),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
