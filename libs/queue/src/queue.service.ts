import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { JobOptions, Queue } from 'bull'

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('logger')
    private loggerQueue: Queue,

    @InjectQueue('worker')
    private workerQueue: Queue,
  ) {}

  async addLog(name: string, data: any, opts?: JobOptions) {
    const count = await this.loggerQueue.count()
    // count > 1M -> clean 100K latest jobs
    if (count > 1000000) {
      await this.loggerQueue.clean(100, 'wait', 100000)
    }
    return await this.loggerQueue.add(name, data, opts)
  }

  async addJob(name: string, data: any, opts?: JobOptions) {
    return await this.workerQueue.add(name, data, opts)
  }
}
