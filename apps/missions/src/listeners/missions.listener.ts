import { Injectable } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { IEventByName } from '../interfaces/missions.interface'
import { ExternalUserService } from '@lib/external-user'
import { EVENTS, MissionService } from '@lib/mission'
import { MissionsService } from '../missions.service'
import { RedisService } from '@lib/redis'
import { QUEUE_MISSION_MAIN_FUNCTION } from '@lib/queue'
import { QueueService } from '@lib/queue/queue.service'
import { EventEmitterType } from '@lib/common'

@Injectable()
export class MissionsListener {
  constructor(
    private eventEmitter: EventEmitter2,
    private externalUserService: ExternalUserService,
    private missionsService: MissionsService,
    private missionService: MissionService,
    private redisService: RedisService,
    private readonly queueService: QueueService,
  ) {}

  @OnEvent('received_kafka_event')
  async handleNewEvent(data: IEventByName) {
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
    let missionsByEvent = await this.missionsService.getMissionsByEvent(
      eventName,
    )

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
            'main_' +
            '_' +
            missionEvent.campaignId +
            '_' +
            data.msgData.user_id,
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
