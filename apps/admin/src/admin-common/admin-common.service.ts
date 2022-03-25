import { CreateActionLogInput } from './admin-common.interface'
import { plainToInstance } from 'class-transformer'
import { CreateAdminActionLogDto } from '@lib/admin-action-log/dto/create-admin-action-log.dto'
import { Injectable } from '@nestjs/common'
import { AdminActionLogService } from '@lib/admin-action-log'
import {
  GRANT_TARGET_USER,
  GRANT_TARGET_WALLET,
  INFO_EVENTS,
} from '@lib/mission'

@Injectable()
export class AdminCommonService {
  constructor(private readonly adminActionLogService: AdminActionLogService) {}

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
    return INFO_EVENTS
  }

  listGrantTargetWallets() {
    return Object.keys(GRANT_TARGET_WALLET)
      .filter((key) =>
        [
          GRANT_TARGET_WALLET.DIRECT_BALANCE,
          GRANT_TARGET_WALLET.DIRECT_CASHBACK,
        ].includes(GRANT_TARGET_WALLET[key]),
      )
      .map((key) => {
        return {
          key,
          value: GRANT_TARGET_WALLET[key].replace(/_/g, ' ').toUpperCase(),
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
