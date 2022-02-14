import { Controller } from '@nestjs/common'
import { AdminCommonService } from './admin-common.service'
import { GrpcMethod } from '@nestjs/microservices'
import { CreateActionLogInput } from './admin-common.interface'

@Controller('common')
export class AdminCommonController {
  constructor(private readonly adminCommonService: AdminCommonService) {}

  @GrpcMethod('GrpcAdminCommonService', 'CreateActionLog')
  async createActionLog(data: CreateActionLogInput): Promise<any> {
    return await this.adminCommonService.createLogAction(data)
  }
}
