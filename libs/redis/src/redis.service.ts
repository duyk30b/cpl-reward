import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { Cache, CachingConfig } from 'cache-manager'

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get(key: string) {
    return await this.cacheManager.get(key)
  }

  async set(key: string, value, options?: CachingConfig) {
    await this.cacheManager.set(key, value, options)
  }

  async del(key: string) {
    await this.cacheManager.del(key)
  }
}
