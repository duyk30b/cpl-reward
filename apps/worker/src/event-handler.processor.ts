import { TRACE_CODES } from '@lib/campaign/trace-codes'
import { CommonService, EventEmitterType } from '@lib/common'
import { EVENTS, MissionService } from '@lib/mission'
import {
  QueueService,
  QUEUE_EVENT_HANDLER,
  QUEUE_MISSION_MAIN_FUNCTION,
  QUEUE_WRITE_LOG,
} from '@lib/queue'
import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Job } from 'bull'
import * as _ from 'lodash'
import { IEventByName, IWriteLog } from './interfaces/missions.interface'
import { TraceListener } from './listeners/trace.listener'
import { WorkerService } from './worker.service'

@Processor('event_handler')
export class EventHandlerProcessor {
  private readonly logger = new Logger(TraceListener.name)

  constructor(
    private readonly configService: ConfigService,
    private readonly queueService: QueueService,
    private readonly commonService: CommonService,
    private eventEmitter: EventEmitter2,
    private missionService: MissionService,
    private workerService: WorkerService,
  ) {}

  @Process({ name: QUEUE_WRITE_LOG, concurrency: 3 })
  async handleWriteLog(job: Job) {
    const logData: IWriteLog = job.data

    const input = _.cloneDeep(logData)
    const { logLevel, traceCode, params } = input
    let { data, extraData } = input
    data = this.hideInformation(data)
    extraData = this.hideInformation(extraData)

    const msgId = data === undefined ? 'N/A' : data.msgId
    // const missionId = data === undefined ? '' : data.missionId
    // const campaignId = data === undefined ? '' : data.campaignId
    const userId = data === undefined ? '' : data.msgData.user_id
    const msgDataJsonStr =
      data === undefined ? '{}' : JSON.stringify(data.msgData)
    const msgExtraDataJsonStr =
      extraData === undefined ? '{}' : JSON.stringify(extraData)

    const message =
      `[${msgId}] | ` +
      `[USER_${userId}] | ` +
      `[Message: ${
        TRACE_CODES[traceCode] === undefined
          ? this.commonService.getLogMessageFromTemplate(traceCode, params)
          : this.commonService.getLogMessageFromTemplate(
              TRACE_CODES[traceCode],
              params === undefined ? {} : params,
            )
      }] | ` +
      `[Data: ${msgDataJsonStr}] | ` +
      `[Extra: ${msgExtraDataJsonStr}]`

    switch (logLevel) {
      case 'debug':
        this.logger.debug(message)
        break
      case 'warn':
        this.logger.warn(message)
        break
      case 'error':
        this.logger.error(message)
        break
      default:
        this.logger.log(message)
        break
    }

    if (this.configService.get('enable_save_log')) {
      if (data && data.msgName) {
        const dataLog = {
          msgName: data.msgName,
          type: 'REWARD_' + data.msgName,
          user_id: data.msgData.user_id,
          message_id: data.msgId,
          mission_id: data.missionId,
          data: data,
          level_log: logLevel,
        }
        await this.queueService.addLog('reward_missions', dataLog, {
          removeOnComplete: 10000,
        })
      }
    }
  }

  hideInformation(data: any) {
    if (data && data.msgData) {
      // Email
      if (data.msgData.email) {
        data.msgData.email = CommonService.hideEmail(data.msgData.email)
      }
      if (data.email) {
        data.email = CommonService.hideEmail(data.email)
      }

      // IP
      if (data.msgData.ip) {
        data.msgData.ip = '***'
      }
      if (data.ip) {
        data.ip = '***'
      }
    }
    return data
  }

  @Process({ name: QUEUE_EVENT_HANDLER, concurrency: 3 })
  async handleEvent(job: Job) {
    const data: IEventByName = job.data

    if (!EVENTS[data.msgName]) {
      this.eventEmitter.emit(EventEmitterType.WRITE_LOG, {
        logLevel: 'error',
        traceCode: 'm002',
        data: {
          msgData: data.msgData,
          msgName: data.msgName,
          msgId: data.msgId,
        },
      })
      return
    }
    const eventName = EVENTS[data.msgName]
    let missionsByEvent = await this.workerService.getMissionsByEvent(eventName)

    // Filter only running mission
    const missionIds = missionsByEvent.map((m) => m.missionId)
    const runningMissions = await this.missionService.filterRunningMissions(
      missionIds,
    )
    const runningMissionIds = runningMissions.map((r) => r.id)
    missionsByEvent = missionsByEvent.filter((m) =>
      runningMissionIds.includes(m.missionId),
    )
    if (missionsByEvent.length === 0) {
      this.eventEmitter.emit(EventEmitterType.WRITE_LOG, {
        logLevel: 'warn',
        traceCode: 'm003',
        data: {
          msgData: data.msgData,
          msgName: data.msgName,
          msgId: data.msgId,
        },
      })
      return
    }

    missionsByEvent.map((missionEvent) => {
      this.queueService.addJob(
        QUEUE_MISSION_MAIN_FUNCTION,
        {
          groupKey:
            'main_' + missionEvent.campaignId + '_' + data.msgData.user_id,
          msgId: data.msgId,
          msgName: data.msgName,
          msgData: data.msgData,
          missionId: missionEvent.missionId,
          campaignId: missionEvent.campaignId,
        },
        {
          removeOnComplete: true,
          attempts: 2,
          backoff: 10000,
        },
      )
    })
  }
}
