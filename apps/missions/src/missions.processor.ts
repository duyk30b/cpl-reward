import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { QUEUE_SEND_BALANCE, QUEUE_SEND_CASHBACK } from '@lib/queue'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Processor('reward')
export class MissionsProcessor {
  private readonly logger = new Logger(MissionsProcessor.name)

  constructor(private eventEmitter: EventEmitter2) {}

  @Process(QUEUE_SEND_BALANCE)
  async handleSendBalance(job: Job) {
    this.logger.log('Start send balance...')

    const data = job.data
    this.eventEmitter.emit('send_reward_to_balance', data)

    this.logger.log('sent balance')
  }

  @Process(QUEUE_SEND_CASHBACK)
  async handleSendCashback(job: Job) {
    this.logger.log('Start send cashback...')

    const data = job.data
    this.eventEmitter.emit('send_reward_to_cashback', data)

    this.logger.log('sent cashback')
  }
}
