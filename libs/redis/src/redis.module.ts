import { RedisService } from './redis.service'
import * as redisStore from 'cache-manager-redis-store'
import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import redis from 'config/redis'

@Module({
  imports: [
    ConfigModule,
    CacheModule.registerAsync({
      imports: [ConfigModule.forRoot({ load: [redis] })],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('redis_config.host'),
        port: configService.get('redis_config.port'),
        db: configService.get('redis_config.db'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
