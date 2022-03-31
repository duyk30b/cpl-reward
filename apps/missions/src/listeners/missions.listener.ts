import { Injectable, Logger } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import {
  IGiveRewardToUser,
  JudgmentCondition,
  UserCondition,
  IEventByName,
} from '../interfaces/missions.interface'
import { ExternalUserService } from '@lib/external-user'
import { EVENTS, MissionService, STATUS_MISSION } from '@lib/mission'
import * as moment from 'moment-timezone'
import { MissionsService } from '../missions.service'
import { RewardRuleService, TYPE_RULE } from '@lib/reward-rule'
import { CampaignService, STATUS_CAMPAIGN } from '@lib/campaign'

@Injectable()
export class MissionsListener {
  private readonly logger = new Logger(MissionsListener.name)

  constructor(
    private eventEmitter: EventEmitter2,
    private externalUserService: ExternalUserService,
    private missionsService: MissionsService,
  ) {}

  @OnEvent('received_kafka_event')
  async handleNewEvent(eventByName: IEventByName) {
    if (!EVENTS[eventByName.eventName]) {
      this.logger.error(
        `[EVENT ${eventByName.eventName}] not registered. Developer please add this event to enum EVENTS`,
      )
      return
    }
    const eventName = EVENTS[eventByName.eventName]
    const missionsByEvent = await this.missionsService.getMissionsByEvent(
      eventName,
    )
    if (missionsByEvent.length === 0) {
      this.logger.log(`[EVENT ${eventName}] has no corresponding mission`)
      return
    }
    missionsByEvent.map((missionEvent) => {
      this.missionsService.mainFunction({
        messageValueData: eventByName.messageValueData,
        missionId: missionEvent.missionId,
        campaignId: missionEvent.campaignId,
        eventName: eventByName.eventName,
      })
    })
  }
}
