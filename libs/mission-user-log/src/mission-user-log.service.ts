import { Injectable } from '@nestjs/common'
import { MissionUserLog } from '@lib/mission-user-log/entities/mission-user-log.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { plainToInstance } from 'class-transformer'
import { CreateMissionUserLogDto } from '@lib/mission-user-log/dto/create-mission-user-log.dto'
import { paginate } from 'nestjs-typeorm-paginate'
import {
  ListMissionUserLogDto,
  MissionUserSortable,
} from './dto/list-mission-user-log.dto'
import { formatPaginate } from '@lib/common/utils'
import { MissionUserLogStatus } from '@lib/common'
import { MissionUserFilterDto } from './dto/mission-user-filter.dto'
import { UpdateMissionUserLogDto } from './dto/update-mission-user-log.dto'

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

  async getList(filter: ListMissionUserLogDto) {
    const queryBuilder = this.missionUserLogRepository
      .createQueryBuilder()
      .where({
        status: MissionUserLogStatus.NEED_TO_RESOLVE,
      })

    if (MissionUserSortable.includes(filter.sort)) {
      queryBuilder.orderBy(filter.sort, filter.sortType)
    } else {
      queryBuilder.orderBy('id', 'DESC')
    }

    const paginateResult = paginate(queryBuilder, {
      page: filter.page ? filter.page : 1,
      limit: filter.limit ? filter.limit : 10,
    })

    return formatPaginate(paginateResult)
  }

  async update(id: number, missionUser: UpdateMissionUserLogDto) {
    return await this.missionUserLogRepository
      .createQueryBuilder()
      .update(MissionUserLog)
      .set({
        ...missionUser,
      })
      .where({ id })
      .execute()
  }

  async count(filter: MissionUserFilterDto) {
    return await this.missionUserLogRepository.count({
      where: { ...filter },
    })
  }
}
