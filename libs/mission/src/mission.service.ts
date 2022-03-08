import { Injectable } from '@nestjs/common'
import { Mission } from '@lib/mission/entities/mission.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { CreateMissionDto } from '@lib/mission/dto/create-mission.dto'
import { plainToInstance } from 'class-transformer'
import { UpdateMissionDto } from '@lib/mission/dto/update-mission.dto'
import { CustomPaginationMetaTransformer } from '@lib/common/transformers/custom-pagination-meta.transformer'
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder'
import { IPaginationOptions } from 'nestjs-typeorm-paginate/dist/interfaces'

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
  ) {}

  async getById(id: number, options = undefined): Promise<Mission> {
    return await this.missionRepository.findOne(id, options)
  }

  async update(updateMissionDto: UpdateMissionDto): Promise<Mission> {
    const updateMission = plainToInstance(UpdateMissionDto, updateMissionDto, {
      ignoreDecorators: true,
      excludeExtraneousValues: true,
    })
    const missionEntity = plainToInstance(Mission, updateMission, {
      ignoreDecorators: true,
    })
    return await this.missionRepository.save(missionEntity)
  }

  async create(createMissionDto: CreateMissionDto): Promise<Mission> {
    const createMission = plainToInstance(CreateMissionDto, createMissionDto, {
      ignoreDecorators: true,
      excludeExtraneousValues: true,
    })
    const missionEntity = plainToInstance(Mission, createMission, {
      ignoreDecorators: true,
    })
    return await this.missionRepository.save(missionEntity)
  }

  initQueryBuilder(): SelectQueryBuilder<Mission> {
    return this.missionRepository.createQueryBuilder('mission')
  }

  private queryBuilder(): SelectQueryBuilder<Mission> {
    const queryBuilder = this.missionRepository.createQueryBuilder('mission')
    queryBuilder.orderBy('mission.id', 'DESC')
    queryBuilder.leftJoinAndSelect(
      'mission.rewardRules',
      'rewardRules',
      "rewardRules.type_rule = 'mission'",
    )
    return queryBuilder
  }

  async camelPaginate(
    options: IPaginationOptions,
    queryBuilder: SelectQueryBuilder<Mission> = null,
  ): Promise<Pagination<Mission>> {
    if (queryBuilder === null) queryBuilder = this.queryBuilder()
    return paginate<Mission>(queryBuilder, options)
  }

  async snakePaginate(
    options: IPaginationOptions<CustomPaginationMetaTransformer>,
    queryBuilder: SelectQueryBuilder<Mission> = null,
  ): Promise<Pagination<Mission, CustomPaginationMetaTransformer>> {
    if (queryBuilder === null) queryBuilder = this.queryBuilder()
    return paginate<Mission, CustomPaginationMetaTransformer>(
      queryBuilder,
      options,
    )
  }
}
