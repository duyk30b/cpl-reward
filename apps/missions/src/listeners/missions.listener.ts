import { Injectable } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { IEventByName } from '../interfaces/missions.interface'
import { ExternalUserService } from '@lib/external-user'
import { EVENTS, MissionService } from '@lib/mission'
import { MissionsService } from '../missions.service'
import { CommonService } from '@lib/common'
import { RedisService } from '@lib/redis'
import { QUEUE_MISSION_MAIN_FUNCTION } from '@lib/queue'
import { RedisQueueService } from '@lib/redis-queue'

@Injectable()
export class MissionsListener {
  constructor(
    private eventEmitter: EventEmitter2,
    private externalUserService: ExternalUserService,
    private missionsService: MissionsService,
    private missionService: MissionService,
    private redisService: RedisService,
    private readonly redisQueue: RedisQueueService,
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

    for (let i = 0; i < missionsByEvent.length; i++) {
      const missionEvent = missionsByEvent[i]
      // throttleTime nên đặt là số chẵn
      // Nếu fail thì retry sau throttleTime + 1 giây (số lẻ)
      // Giảm thiểu deadlock cho Cashback service
      const throttleTime = 2 // Redis ttl tính theo giây, bull tính theo ms nên đoạn dưới nhân 1000
      let delayTime = 0
      const keyName = 'reward-throttle-' + data.msgData.user_id
      const currentTime = CommonService.currentUnixTime()
      const lastRequestTime = await this.redisService.get(keyName)
      if (!lastRequestTime) {
        await this.redisService.set(keyName, currentTime, {
          ttl: throttleTime,
        })
      } else {
        let intNextRequest = parseInt(lastRequestTime.toString())
        if (intNextRequest >= currentTime) {
          intNextRequest += throttleTime
          delayTime = intNextRequest - currentTime
        } else {
          intNextRequest = currentTime
        }
        await this.redisService.set(keyName, intNextRequest, {
          ttl: throttleTime,
        })
      }

      await this.redisQueue.addRewardMissionsJob(
        QUEUE_MISSION_MAIN_FUNCTION,
        {
          groupKey: data.msgData.user_id,
          msgId: data.msgId,
          msgName: data.msgName,
          msgData: data.msgData,
          missionId: missionEvent.missionId,
          campaignId: missionEvent.campaignId,
        },
        { delay: delayTime * 1000 },
      )
    }
  }
}
