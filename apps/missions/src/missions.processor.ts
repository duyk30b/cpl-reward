import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { QUEUE_MISSION_MAIN_FUNCTION } from '@lib/queue'

import { MissionsService } from './missions.service'

@Processor('worker')
export class MissionsProcessor {
  private readonly logger = new Logger(MissionsProcessor.name)

  constructor(private missionsService: MissionsService) {}

  @Process(QUEUE_MISSION_MAIN_FUNCTION)
  handleMainFunction(job: Job) {
    // console.log(
    //   job.data.msgData.user_id + ' Bat dau cong balance: ',
    //   Date.now() / 1000,
    // )
    this.logger.log(job.data.msgId + ' is running')
    this.missionsService.mainFunction(job.data).then(() => {
      this.logger.log(job.data.msgId + ' done!')
    })
  }
}
