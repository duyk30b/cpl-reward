import {
  CreateActionLogInput,
  ListPropertiesByEventInput,
} from './admin-common.interface'
import { plainToInstance } from 'class-transformer'
import { CreateAdminActionLogDto } from '@lib/admin-action-log/dto/create-admin-action-log.dto'
import { Injectable } from '@nestjs/common'
import { AdminActionLogService } from '@lib/admin-action-log'
import { EVENTS, GRANT_TARGET_WALLET } from '@lib/mission'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AdminCommonService {
  constructor(
    private readonly adminActionLogService: AdminActionLogService,
    private configService: ConfigService,
  ) {}

  createLogAction(createActionLogInput: CreateActionLogInput) {
    const createActionLog = plainToInstance(
      CreateAdminActionLogDto,
      createActionLogInput,
      {
        ignoreDecorators: true,
      },
    )
    return this.adminActionLogService.create(createActionLog)
  }

  listEvents() {
    const events = Object.values(EVENTS).filter((item) => item !== '')
    return events.toString()
  }

  listPropertiesByEvent(data: ListPropertiesByEventInput) {
    const events = Object.values(EVENTS).filter((item) => item !== '')
    const eventName = data.eventName
    if (events.filter((item) => item === eventName).length < 1) return ''

    return this.configService.get(`mission.${eventName}_properties`)
  }

  listGrantTargetWallet() {
    const wallets = Object.values(GRANT_TARGET_WALLET)
    return wallets.toString()
  }
}
