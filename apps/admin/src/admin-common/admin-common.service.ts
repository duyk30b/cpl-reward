import { CreateActionLogInput } from './admin-common.interface'
import { plainToInstance } from 'class-transformer'
import { CreateAdminActionLogDto } from '@app/admin-action-log/dto/create-admin-action-log.dto'
import { Injectable } from '@nestjs/common'
import { AdminActionLogService } from '@app/admin-action-log'

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
}
