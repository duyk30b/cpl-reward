import { CreateActionLogInput } from './admin-common.interface'
import { plainToInstance } from 'class-transformer'
import { CreateAdminActionLogDto } from '@lib/admin-action-log/dto/create-admin-action-log.dto'
import { Injectable } from '@nestjs/common'
import { AdminActionLogService } from '@lib/admin-action-log'
import {
  GRANT_TARGET_USER,
  DELIVERY_METHOD_WALLET,
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
    return Object.keys(DELIVERY_METHOD_WALLET)
      .filter((key) =>
        [
          DELIVERY_METHOD_WALLET.DIRECT_BALANCE,
          DELIVERY_METHOD_WALLET.DIRECT_CASHBACK,
        ].includes(DELIVERY_METHOD_WALLET[key]),
      )
      .map((key) => {
        return {
          key,
          value: DELIVERY_METHOD_WALLET[key].replace(/_/g, ' ').toUpperCase(),
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
