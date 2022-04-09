import { Injectable } from '@nestjs/common'
import { MissionUserLog } from '@lib/mission-user-log/entities/mission-user-log.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { plainToInstance } from 'class-transformer'
import { CreateMissionUserLogDto } from '@lib/mission-user-log/dto/create-mission-user-log.dto'

@Injectable()
export class MissionUserLogService {
  constructor(
    @InjectRepository(MissionUserLog)
    private missionUserLogRepository: Repository<MissionUserLog>,
  ) {}

  async save(missionUserLog: CreateMissionUserLogDto) {
    const createMissionUserLog = plainToInstance(
      CreateMissionUserLogDto,
      missionUserLog,
      {
        ignoreDecorators: true,
        excludeExtraneousValues: true,
      },
    )
    const missionUserLogEntity = plainToInstance(
      MissionUserLog,
      createMissionUserLog,
      {
        ignoreDecorators: true,
      },
    )
    return await this.missionUserLogRepository.save(missionUserLogEntity)
  }
}
