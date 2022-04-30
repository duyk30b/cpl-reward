import { Injectable } from '@nestjs/common'
import { BullOptionsFactory as Factory, BullModuleOptions } from '@nestjs/bull'
import { ConfigService } from '@nestjs/config'
import * as Redis from 'ioredis'

@Injectable()
export class BullOptionsFactory implements Factory {
  public constructor(private configService: ConfigService) {}

  public createBullOptions(): BullModuleOptions {
    const password = this.configService.get<string>('queue.pass')
    const option: Redis.RedisOptions = {
      host: this.configService.get<string>('queue.host'),
      port: this.configService.get<number>('queue.port'),
      db: this.configService.get<number>('queue.queue_db'),
    }
    if (password) {
      option.password = password
    }
    return { redis: option }
  }
}
