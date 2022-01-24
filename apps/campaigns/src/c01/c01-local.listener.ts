import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import campaignConfig from './c01.config'
import { EventCampaignUserLog } from '@app/common/interfaces/event-campaign-user-log'
import { CampaignUserLog } from '@app/campaign-user-log/entities/campaign-user-log.entity'
import { plainToInstance } from 'class-transformer'
import { CampaignUserLogService } from '@app/campaign-user-log'

@Injectable()
export class C01LocalListener {
  constructor(
    private readonly campaignUserLogService: CampaignUserLogService,
  ) {}

  @OnEvent(campaignConfig.eventLogPrefix + '*')
  handleCampaignLog(event: EventCampaignUserLog) {
    const campaignUserLog = plainToInstance(
      CampaignUserLog,
      event.campaignUser,
      { ignoreDecorators: true, excludePrefixes: ['id'] },
    )
    let note = ''
    if (event.isNewUser) {
      note += 'User join the campaign. '
    }

    if (event.isGiveRewardSuccess) {
      note += 'Give reward successfully. '
    }

    const eventName = event.name.replace(campaignConfig.eventLogPrefix, '')
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

    campaignUserLog.note = note
    this.campaignUserLogService.save(campaignUserLog)
  }
}
