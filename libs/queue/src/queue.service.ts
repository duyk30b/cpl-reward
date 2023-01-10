import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { JobOptions, Queue } from 'bull'
import {
  QUEUE_NAME_SEND_REWARD,
  QUEUE_SEND_BALANCE,
  QUEUE_SEND_REWARD,
} from './constant'
import { SendRewardJob } from 'apps/worker/src/interfaces/external.interface'

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('logger')
    private loggerQueue: Queue,

    @InjectQueue('worker')
    private workerQueue: Queue,

    @InjectQueue('banker_balance')
    private bankerBalanceQueue: Queue,

    @InjectQueue('banker_cashback')
    private bankerCashbackQueue: Queue,

    @InjectQueue('event_handler')
    private eventHandler: Queue,

    @InjectQueue(QUEUE_NAME_SEND_REWARD)
    private sendRewardQueue: Queue,
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

  async addSendMoneyJob(
    userId: string,
    queueName: string,
    attempts: number,
    data: any,
  ) {
    data.groupKey = queueName + '_' + userId

    if (queueName == QUEUE_SEND_BALANCE) {
      // Balance ko thể nhận nhiều request cùng lúc nên groupKey fix cứng luôn
      await this.addBalanceJob(queueName, data, {
        attempts: attempts,
        backoff: 1000,
        removeOnComplete: true,
      })
      return
    }

    // Cashback giới hạn bắn ko quá 20 request 1 giây
    await this.addCashbackJob(queueName, data, {
      attempts: attempts,
      backoff: 1000,
      removeOnComplete: true,
    })
    return
  }

  async addBalanceJob(name: string, data: any, opts?: JobOptions) {
    return await this.bankerBalanceQueue.add(name, data, opts)
  }

  async addCashbackJob(name: string, data: any, opts?: JobOptions) {
    return await this.bankerCashbackQueue.add(name, data, opts)
  }

  async addEventHandlerJob(name: string, data: any, opts?: JobOptions) {
    return await this.eventHandler.add(name, data, opts)
  }

  async addSendRewardJob(data: SendRewardJob, attempts = 0) {
    data.groupKey = QUEUE_SEND_REWARD + '_' + data.userId

    return await this.sendRewardQueue.add(QUEUE_SEND_REWARD, data, {
      attempts: attempts,
      backoff: 1000,
      removeOnComplete: true,
    })
  }
}
