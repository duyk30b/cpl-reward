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
    return await this.rewardMissionsQueue.add(name, data)
  }
}
