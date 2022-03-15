import { Injectable } from '@nestjs/common'
import {
  MISSION_SEARCH_FIELD_MAP,
  MISSION_SORT_FIELD_MAP,
  MissionService,
} from '@lib/mission'
import { ApiMissionFilterDto } from './dto/api-mission-filter.dto'
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder'
import { Brackets } from 'typeorm'
import { Mission } from '@lib/mission/entities/mission.entity'
import {
  IPaginationLinks,
  IPaginationMeta,
  PaginationTypeEnum,
} from 'nestjs-typeorm-paginate'
import { CustomPaginationMetaTransformer } from '@lib/common/transformers/custom-pagination-meta.transformer'
import { STATUS } from '@lib/user-reward-history'

@Injectable()
export class ApiMissionService {
  constructor(private readonly missionService: MissionService) {}

  async findAll(apiMissionFilterDto: ApiMissionFilterDto, userId: number) {
    const limit =
      (apiMissionFilterDto.limit > 100 ? 100 : apiMissionFilterDto.limit) || 20
    const page = apiMissionFilterDto.page || 1
    const options = {
      page,
      limit,
      metaTransformer: (
        pagination: IPaginationMeta,
      ): CustomPaginationMetaTransformer =>
        new CustomPaginationMetaTransformer(
          pagination.totalItems,
          pagination.itemsPerPage,
          pagination.currentPage,

          pagination.itemCount,
          pagination.totalPages,
        ),
      route: '/missions',
      paginationType: PaginationTypeEnum.LIMIT_AND_OFFSET,
    }
    const queryBuilder = this.queryBuilder(apiMissionFilterDto)
    const result = await this.missionService.snakePaginate(
      options,
      queryBuilder,
    )
    // TODO: fake response data for frontend team integrate
    const statusList = [
      STATUS.NOT_RECEIVE,
      STATUS.AUTO_RECEIVED,
      STATUS.MANUAL_NOT_RECEIVE,
      STATUS.MANUAL_RECEIVED,
    ]
    const data = result.items.map((mission) => {
      return {
        id: mission.id,
        title: mission.title,
        amount: Math.floor(Math.random() * 100),
        currency: 'USDT',
        status: statusList[Math.floor(Math.random() * statusList.length)],
      }
    })
    return {
      pagination: result.meta,
      data,
      links: ApiMissionService.customLinks(result.links),
    }
  }

  private static customLinks(links: IPaginationLinks) {
    return {
      first: links.first,
      prev: links.previous,
      last: links.last,
      next: links.next,
    }
  }

  private queryBuilder(
    missionFilter: ApiMissionFilterDto,
  ): SelectQueryBuilder<Mission> {
    const { searchField, searchText, sort, sortType } = missionFilter
    const queryBuilder = this.missionService.initQueryBuilder()
    if (missionFilter.campaignId !== undefined)
      queryBuilder.where('mission.campaignId = :campaign_id ', {
        campaign_id: Number(missionFilter.campaignId),
      })
    if (searchText) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          if (searchField && MISSION_SEARCH_FIELD_MAP[searchField]) {
            qb.where(`${MISSION_SEARCH_FIELD_MAP[searchField]} LIKE :keyword`)
          } else {
            Object.keys(MISSION_SEARCH_FIELD_MAP).forEach((field) => {
              qb.orWhere(`${MISSION_SEARCH_FIELD_MAP[field]} LIKE :keyword`)
            })
          }
        }),
        {
          keyword: `%${ApiMissionService.escapeLikeChars(searchText)}%`,
        },
      )
    }

    if (sort && MISSION_SORT_FIELD_MAP[sort]) {
      queryBuilder
        .orderBy(MISSION_SORT_FIELD_MAP[sort], sortType || 'ASC')
        .addOrderBy('mission.priority', 'DESC')
        .addOrderBy('mission.id', 'DESC')
    } else {
      queryBuilder
        .orderBy('mission.priority', 'DESC')
        .addOrderBy('mission.id', 'DESC')
    }

    return queryBuilder
  }

  private static escapeLikeChars(str: string) {
    return str.replace(/%/g, '\\%').replace(/_/g, '\\_')
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
