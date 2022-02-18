import { Injectable } from '@nestjs/common'
import { MissionUserLog } from '@lib/mission-user-log/entities/mission-user-log.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class MissionUserLogService {
  constructor(
    @InjectRepository(MissionUserLog)
    private missionUserLogRepository: Repository<MissionUserLog>,
  ) {}
  async save(missionUserLog: MissionUserLog) {
    return await this.missionUserLogRepository.save(missionUserLog)
  }
}
