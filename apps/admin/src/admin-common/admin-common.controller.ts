import { Controller } from '@nestjs/common'
import { AdminCommonService } from './admin-common.service'
import { GrpcMethod } from '@nestjs/microservices'
import {
  CreateActionLogInput,
  ListPropertiesByEventInput,
} from './admin-common.interface'

@Controller('common')
export class AdminCommonController {
  constructor(private readonly adminCommonService: AdminCommonService) {}

  @GrpcMethod('GrpcAdminCommonService', 'CreateActionLog')
  async createActionLog(data: CreateActionLogInput): Promise<any> {
    return await this.adminCommonService.createLogAction(data)
  }

  @GrpcMethod('GrpcAdminCommonService', 'ListEvents')
  listEvents() {
    const list = this.adminCommonService.listEvents()
    return { list }
  }

  @GrpcMethod('GrpcAdminCommonService', 'ListPropertiesByEvent')
  listPropertiesByEvent(data: ListPropertiesByEventInput) {
    const list = this.adminCommonService.listPropertiesByEvent(data)
    return { list }
  }

  @GrpcMethod('GrpcAdminCommonService', 'ListGrantTarget')
  listGrantTarget() {
    const wallets = this.adminCommonService.listGrantTargetWallet()
    return { user: 'user,referer_user', wallet: wallets }
  }
}
