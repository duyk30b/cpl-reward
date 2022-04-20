import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue, JobStatus } from 'bull'
import RedisQueue from 'config/redis_queue'

@Injectable()
export class RedisQueueService {
  constructor(
    @InjectQueue(RedisQueue.rq_reward_missions)
    private rewardMissionsQueue: Queue,
  ) {}

  private readonly QUEUE_STATES: JobStatus[] = [
    'waiting',
    'active',
    'completed',
    'failed',
    'delayed',
    'paused',
  ]

  async addRewardMissionsJob(name: string, data: any) {
    const count = await this.rewardMissionsQueue.count()
    // count > 1M -> clean 100K lastest jobs
    if (count > 1000000) {
      await this.rewardMissionsQueue.clean(100, 'wait', 100000)
    }
    return await this.rewardMissionsQueue.add(name, data)
  }
}