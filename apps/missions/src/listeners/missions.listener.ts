import { Injectable } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { IEventByName } from '../interfaces/missions.interface'
import { ExternalUserService } from '@lib/external-user'
import { EVENTS } from '@lib/mission'
import { MissionsService } from '../missions.service'

@Injectable()
export class MissionsListener {
  constructor(
    private eventEmitter: EventEmitter2,
    private externalUserService: ExternalUserService,
    private missionsService: MissionsService,
  ) {}

  @OnEvent('received_kafka_event')
  async handleNewEvent(data: IEventByName) {
    if (!EVENTS[data.msgName]) {
      this.eventEmitter.emit('write_log', {
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
    const missionsByEvent = await this.missionsService.getMissionsByEvent(
      eventName,
    )
    if (missionsByEvent.length === 0) {
      this.eventEmitter.emit('write_log', {
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
      this.missionsService.mainFunction({
        msgId: data.msgId,
        msgName: data.msgName,
        msgData: data.msgData,
        missionId: missionEvent.missionId,
        campaignId: missionEvent.campaignId,
      })
    })
  }
}
