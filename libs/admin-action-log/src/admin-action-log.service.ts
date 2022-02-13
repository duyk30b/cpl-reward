import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AdminActionLog } from '@app/admin-action-log/entities/admin-action-log.entity'
import { Repository } from 'typeorm'
import { CreateAdminActionLogDto } from '@app/admin-action-log/dto/create-admin-action-log.dto'
import { plainToInstance } from 'class-transformer'

@Injectable()
export class AdminActionLogService {
  constructor(
    @InjectRepository(AdminActionLog)
    private adminActionLogRepository: Repository<AdminActionLog>,
  ) {}

  async create(
    createAdminActionLogDto: CreateAdminActionLogDto,
  ): Promise<AdminActionLog> {
    createAdminActionLogDto = plainToInstance(
      CreateAdminActionLogDto,
      createAdminActionLogDto,
      {
        excludeExtraneousValues: true,
      },
    )

    const adminActionLog = plainToInstance(
      AdminActionLog,
      createAdminActionLogDto,
      {
        ignoreDecorators: true,
      },
    )

    return this.adminActionLogRepository.create(adminActionLog)
  }
}
