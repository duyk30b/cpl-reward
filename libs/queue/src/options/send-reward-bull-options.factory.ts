import { Injectable } from '@nestjs/common'
import { BullOptionsFactory, BullModuleOptions } from '@nestjs/bull'
import { ConfigService } from '@nestjs/config'
import * as Redis from 'ioredis'

@Injectable()
export class SendRewardBullOptions implements BullOptionsFactory {
  public constructor(private configService: ConfigService) {}

  public createBullOptions(): BullModuleOptions {
    const limitDuration = this.configService.get<number>(
      'redis_config.send_reward_limit_duration',
    )
    const password = this.configService.get<string>('redis_config.password')
    const option: Redis.RedisOptions = {
      host: this.configService.get<string>('redis_config.host'),
      port: this.configService.get<number>('redis_config.port'),
      db: this.configService.get<number>('redis_config.db'),
    }
    if (password) {
      option.password = password
    }
    return {
      redis: option,
      limiter: {
        duration: limitDuration,
        max: 1,
        groupKey: 'groupKey',
      },
    }
  }
}
