import { Injectable, Logger } from '@nestjs/common'
import {
  GRANT_TARGET_USER,
  IS_ACTIVE_MISSION,
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
import { CommonService } from '@lib/common/common.service'
import { instanceToPlain } from 'class-transformer'
import { Target } from './api-mission.interface'
import { FixedNumber } from 'ethers'

@Injectable()
export class ApiMissionService {
  private readonly logger = new Logger(ApiMissionService.name)

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
    const result = await this.missionService.paginate(options, queryBuilder)

    if (result.items.length === 0) {
      return {
        pagination: result.meta,
        data: result.items,
        links: CommonService.customLinks(result.links),
      }
    }

    const missionIds = []
    for (const idx in result.items) {
      missionIds.push(result.items[idx].id)
    }
    const receivedHistories =
      await this.userRewardHistoryService.getAmountByUser(missionIds, userId, [
        STATUS.AUTO_RECEIVED,
        STATUS.MANUAL_RECEIVED,
      ])
    const notReceivedHistories =
      await this.userRewardHistoryService.getAmountByUser(missionIds, userId, [
        STATUS.MANUAL_NOT_RECEIVE,
      ])

    return {
      pagination: result.meta,
      data: result.items.map((item) => {
        const money = this.getMoneyOfUser(
          item.grantTarget,
          item.id,
          receivedHistories,
          notReceivedHistories,
          item.limitReceivedReward,
        )
        delete item.grantTarget
        return {
          ...instanceToPlain(item, { exposeUnsetFields: false }),
          currency: money.currency,
          total_reward_amount: money.totalRewardAmount,
          received_amount: money.receivedAmount,
          not_received_amount: money.notReceivedAmount,
          status: money.status,
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
    queryBuilder.select([
      'mission.title',
      'mission.titleJp',
      'mission.id',
      'mission.detailExplain',
      'mission.detailExplainJp',
      'mission.openingDate',
      'mission.closingDate',
      'mission.guideLink',
      'mission.guideLinkJp',
      'mission.limitReceivedReward',
      'mission.grantTarget',
    ])
    queryBuilder.where('mission.isActive = :is_active ', {
      is_active: IS_ACTIVE_MISSION.ACTIVE,
    })
    if (missionFilter.campaignId !== undefined)
      queryBuilder.andWhere('mission.campaignId = :campaign_id ', {
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

  private getMoneyOfUser(
    grantTarget: string,
    missionId: number,
    receivedHistories: any,
    notReceivedHistories: any,
    limitReceivedReward: number,
  ) {
    this.logger.log(
      `grantTarget: ${JSON.stringify(grantTarget)}, ` +
        `receivedHistories: ${JSON.stringify(
          receivedHistories,
        )}, missionId: ${missionId}`,
    )
    const grantTargetObj = grantTarget as unknown as Target[]
    let currentTarget = null
    grantTargetObj.map((target) => {
      if (target.user === GRANT_TARGET_USER.USER) currentTarget = target
      return target
    })
    this.logger.log(`currentTarget: ${JSON.stringify(currentTarget)}`)
    let receivedAmount = FixedNumber.fromString('0')
    if (
      receivedHistories !== null &&
      receivedHistories[`${missionId}_${currentTarget.currency}`] !== undefined
    ) {
      receivedAmount = FixedNumber.fromString(
        receivedHistories[`${missionId}_${currentTarget.currency}`],
      )
    }

    let notReceivedAmount = FixedNumber.fromString('0')
    if (
      notReceivedHistories !== null &&
      notReceivedHistories[`${missionId}_${currentTarget.currency}`] !==
        undefined
    ) {
      notReceivedAmount = FixedNumber.fromString(
        notReceivedHistories[`${missionId}_${currentTarget.currency}`],
      )
    }

    const fixedAmount = FixedNumber.fromString(currentTarget.amount)
    const totalRewardAmount =
      FixedNumber.from(limitReceivedReward).mulUnsafe(fixedAmount)

    return {
      currency: currentTarget.currency,
      totalRewardAmount: totalRewardAmount.toString(),
      receivedAmount: receivedAmount.toString(),
      notReceivedAmount: notReceivedAmount.toString(),
      status: totalRewardAmount.subUnsafe(receivedAmount).isZero() ? 1 : 0,
    }
  }
}
