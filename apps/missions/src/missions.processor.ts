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
    //const start = new Date().getTime()
    //this.logger.log(job.data.msgId + ' is running')
    this.missionsService.mainFunction(job.data).then(() => {
      //const stop = new Date().getTime()
      //this.logger.log(job.data.msgId + ' done !' + (stop - start))
    })
  }
}
