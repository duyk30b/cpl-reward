import { CreateActionLogInput } from './admin-common.interface'
import { plainToInstance } from 'class-transformer'
import { CreateAdminActionLogDto } from '@lib/admin-action-log/dto/create-admin-action-log.dto'
import { Injectable } from '@nestjs/common'
import { AdminActionLogService } from '@lib/admin-action-log'
import { EVENTS, GRANT_TARGET_USER, GRANT_TARGET_WALLET } from '@lib/mission'
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
    return { events: JSON.stringify(EVENTS) }
  }

  listGrantTargetWallets() {
    return Object.keys(GRANT_TARGET_WALLET).map((key) => {
      return {
        key,
        value: GRANT_TARGET_WALLET[key],
      }
    })
  }

  listGrantTargetUsers() {
    return [
      {
        key: GRANT_TARGET_USER.USER,
        value: 'User',
      },
      {
        key: GRANT_TARGET_USER.REFERRAL_USER,
        value: 'Referral User',
      },
    ]
  }
}
