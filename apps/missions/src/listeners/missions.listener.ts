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
  async handleNewEvent(eventByName: IEventByName) {
    if (!EVENTS[eventByName.msgName]) {
      this.eventEmitter.emit('write_log', {
        logLevel: 'error',
        traceCode: 'm002',
        data: {
          msgData: eventByName.msgData,
          msgName: eventByName.msgName,
          msgId: eventByName.msgId,
        },
      })
      return
    }
    const eventName = EVENTS[eventByName.msgName]
    const missionsByEvent = await this.missionsService.getMissionsByEvent(
      eventName,
    )
    if (missionsByEvent.length === 0) {
      this.eventEmitter.emit('write_log', {
        logLevel: 'warn',
        traceCode: 'm003',
        data: {
          msgData: eventByName.msgData,
          msgName: eventByName.msgName,
          msgId: eventByName.msgId,
        },
      })
      return
    }
    missionsByEvent.map((missionEvent) => {
      this.missionsService.mainFunction({
        msgId: eventByName.msgId,
        msgName: eventByName.msgName,
        msgData: eventByName.msgData,
        missionId: missionEvent.missionId,
        campaignId: missionEvent.campaignId,
      })
    })
  }
}
