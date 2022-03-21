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
import { IPaginationMeta, PaginationTypeEnum } from 'nestjs-typeorm-paginate'
import { CustomPaginationMetaTransformer } from '@lib/common/transformers/custom-pagination-meta.transformer'
import { STATUS, UserRewardHistoryService } from '@lib/user-reward-history'
import { CommonService } from '@lib/common'

@Injectable()
export class ApiMissionService {
  constructor(
    private readonly missionService: MissionService,
    private readonly userRewardHistoryService: UserRewardHistoryService,
  ) {}

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
        ),
      route: '/missions',
      paginationType: PaginationTypeEnum.LIMIT_AND_OFFSET,
    }
    const queryBuilder = this.queryBuilder(apiMissionFilterDto)
    const result = await this.missionService.snakePaginate(
      options,
      queryBuilder,
    )

    if (result.items.length === 0) {
      return {
        count: result.items.length,
        pagination: result.meta,
        data: result.items,
        links: CommonService.customLinks(result.links),
      }
    }

    const missionIds = []
    for (const idx in result.items) {
      missionIds.push(result.items[idx].id)
    }
    const histories =
      await this.userRewardHistoryService.getAmountReceivedByUser(
        missionIds,
        userId,
      )
    if (histories === null) {
      return {
        count: result.items.length,
        pagination: result.meta,
        data: result.items.map((item) => {
          return {
            id: item.id,
            title: item.title,
            currency: '',
            status: STATUS.AUTO_NOT_RECEIVE,
            totalAmount: 0,
          }
        }),
        links: CommonService.customLinks(result.links),
      }
    }
    return {
      count: result.items.length,
      pagination: result.meta,
      data: result.items.map((item) => {
        return {
          id: item.id,
          title: item.title,
          currency: !histories[item.id] ? '' : histories[item.id][0].currency,
          status: STATUS.MANUAL_NOT_RECEIVE,
          totalAmount: !histories[item.id]
            ? 0
            : histories[item.id][0].totalAmount,
        }
      }),
      links: CommonService.customLinks(result.links),
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

  async getAmountEarned(userId: number) {
    const result = await this.userRewardHistoryService.getAmountEarned(userId)
    if (result.length === 0)
      return {
        amount: '0',
        currency: '',
      }
    return {
      amount: result[0].total_amount,
      currency: result[0].history_currency,
    }
  }
}
