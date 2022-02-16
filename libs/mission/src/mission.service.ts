import { Injectable } from '@nestjs/common'
import { Mission } from '@app/mission/entities/mission.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { CreateMissionDto } from '@app/mission/dto/create-mission.dto'
import { plainToInstance } from 'class-transformer'
import { UpdateMissionDto } from '@app/mission/dto/update-mission.dto'
import { CustomPaginationMetaTransformer } from '@app/common/transformers/custom-pagination-meta.transformer'
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
    const missionEntity = plainToInstance(Mission, updateMissionDto, {
      ignoreDecorators: true,
    })
    return await this.missionRepository.save(missionEntity)
  }

  async create(createMissionDto: CreateMissionDto): Promise<Mission> {
    const missionEntity = plainToInstance(Mission, createMissionDto, {
      ignoreDecorators: true,
    })
    return await this.missionRepository.save(missionEntity)
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
  ): Promise<Pagination<Mission>> {
    const queryBuilder = this.queryBuilder()
    return paginate<Mission>(queryBuilder, options)
  }

  async snakePaginate(
    options: IPaginationOptions<CustomPaginationMetaTransformer>,
  ): Promise<Pagination<Mission, CustomPaginationMetaTransformer>> {
    const queryBuilder = this.queryBuilder()
    return paginate<Mission, CustomPaginationMetaTransformer>(
      queryBuilder,
      options,
    )
  }
}
