import { Controller } from '@nestjs/common'
import { AdminCommonService } from './admin-common.service'
import { GrpcMethod } from '@nestjs/microservices'
import { CreateActionLogInput } from './admin-common.interface'
import { USER_CONDITION_TYPES } from '@lib/mission'
import { ListEventsDto, UserConditionListDto } from './admin-common.dto'
import { plainToInstance } from 'class-transformer'

@Controller('common')
export class AdminCommonController {
  constructor(private readonly adminCommonService: AdminCommonService) {}

  @GrpcMethod('GrpcAdminCommonService', 'CreateActionLog')
  async createActionLog(data: CreateActionLogInput): Promise<any> {
    return await this.adminCommonService.createLogAction(data)
  }

  @GrpcMethod('GrpcAdminCommonService', 'ListEvents')
  listEvents() {
    const events = this.adminCommonService.listEvents()
    return plainToInstance(ListEventsDto, { events })
  }

  @GrpcMethod('GrpcAdminCommonService', 'ListGrantTarget')
  listGrantTarget() {
    const users = this.adminCommonService.listGrantTargetUsers()
    const wallets = this.adminCommonService.listGrantTargetWallets()
    return { users, wallets }
  }

  @GrpcMethod('GrpcAdminCommonService', 'ListUserConditions')
  listUserConditions() {
    return plainToInstance(UserConditionListDto, {
      list: USER_CONDITION_TYPES,
    })
  }
}
