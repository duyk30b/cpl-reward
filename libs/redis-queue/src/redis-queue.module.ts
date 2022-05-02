import { Module } from '@nestjs/common'
import { RedisQueueService } from './redis-queue.service'
import { BullModule } from '@nestjs/bull'
import { ConfigModule, ConfigService } from '@nestjs/config'
import redis from '../../../config/redis'

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [redis] })],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis_config.host'),
          port: +configService.get('redis_config.port'),
        },
      }),
      inject: [ConfigService],
    }),
    /* List of queue here */
    BullModule.registerQueue({
      name: 'reward',
      // limiter: {
      //   duration: 2000,
      //   max: 1,
      //   bounceBack: false,
      //   groupKey: 'groupKey',
      // },
    }),
  ],
  providers: [RedisQueueService],
  exports: [RedisQueueService],
})
export class RedisQueueModule {}
