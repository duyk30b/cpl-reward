import { QUEUE_MISSION_MAIN_FUNCTION } from '@lib/queue'
import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'

import { WorkerService } from './worker.service'

@Processor('worker')
export class MissionsProcessor {
  private readonly logger = new Logger(MissionsProcessor.name)

  constructor(private workerService: WorkerService) {}

  @Process(QUEUE_MISSION_MAIN_FUNCTION)
  handleMainFunction(job: Job) {
    // const start = new Date().getTime()
    // this.logger.log(
    //   job.data.msgId + ' is running | Mission ' + job.data.missionId,
    // )

    this.workerService.mainFunction(job.data).then(() => {
      // const stop = new Date().getTime()
      // this.logger.log(
      //   job.data.msgId +
      //     ' done | Time: ' +
      //     (stop - start) +
      //     ' ms | Mission ' +
      //     job.data.missionId,
      // )
    })
  }
}
