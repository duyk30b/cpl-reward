import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import missionConfig from './c01.config'
import { EventMissionUserLog } from '@app/common/interfaces/event-mission-user-log'
import { MissionUserLog } from '@app/mission-user-log/entities/mission-user-log.entity'
import { plainToInstance } from 'class-transformer'
import { MissionUserLogService } from '@app/mission-user-log'

@Injectable()
export class C01LocalListener {
  constructor(private readonly missionUserLogService: MissionUserLogService) {}

  @OnEvent(missionConfig.eventLogPrefix + '*')
  handleCampaignLog(event: EventMissionUserLog) {
    const missionUserLog = plainToInstance(MissionUserLog, event.missionUser, {
      ignoreDecorators: true,
      excludePrefixes: ['id'],
    })
    let note = ''
    if (event.isNewUser) {
      note += 'User join the mission. '
    }

    if (event.isGiveRewardSuccess) {
      note += 'Give reward successfully. '
    }

    const eventName = event.name.replace(missionConfig.eventLogPrefix, '')
    switch (eventName) {
      case 'userSpendMoney':
        note +=
          'User spent ' +
          event.extraData.hlUserSpendMoney.amount +
          ' ' +
          event.extraData.hlUserSpendMoney.currency +
          ' in HL mode. '
        break
      default:
        break
    }

    missionUserLog.note = note
    this.missionUserLogService.save(missionUserLog)
  }
}
