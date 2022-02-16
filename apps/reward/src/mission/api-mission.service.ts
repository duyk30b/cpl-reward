import { Injectable } from '@nestjs/common'
import { MissionService } from '@app/mission'
import { IPaginationMeta } from 'nestjs-typeorm-paginate'
import { CustomPaginationMetaTransformer } from '@app/common/transformers/custom-pagination-meta.transformer'

@Injectable()
export class ApiMissionService {
  constructor(private readonly missionService: MissionService) {}

  async findAll(page: number, limit: number) {
    limit = limit > 100 ? 100 : limit
    const options = {
      page,
      limit,
      metaTransformer: (
        meta: IPaginationMeta,
      ): CustomPaginationMetaTransformer =>
        new CustomPaginationMetaTransformer(
          meta.totalItems,
          meta.itemCount,
          meta.itemsPerPage,
          meta.totalPages,
          meta.currentPage,
        ),
    }
    return this.missionService.snakePaginate(options)
  }

  async findOne(id: number) {
    const mission = await this.missionService.getById(id, {
      relations: ['rewardRules'],
    })
    if (!mission) {
      return null
    }
    if (mission.rewardRules.length > 0) {
      mission.rewardRules = mission.rewardRules.filter(
        (item) => item.typeRule == 'mission',
      )
    }

    return mission
  }
}
