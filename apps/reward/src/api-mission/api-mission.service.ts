import { Injectable } from '@nestjs/common'
import {
  GRANT_TARGET_USER,
  MISSION_IS_ACTIVE,
  MISSION_SEARCH_FIELD_MAP,
  MISSION_SORT_FIELD_MAP,
  MissionService,
  TARGET_TYPE,
} from '@lib/mission'
import { ApiMissionFilterDto } from './dto/api-mission-filter.dto'
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder'
import { Brackets } from 'typeorm'
import { Mission } from '@lib/mission/entities/mission.entity'
import { IPaginationMeta, PaginationTypeEnum } from 'nestjs-typeorm-paginate'
import { CustomPaginationMetaTransformer } from '@lib/common/transformers/custom-pagination-meta.transformer'
import {
  USER_REWARD_STATUS,
  UserRewardHistoryService,
} from '@lib/user-reward-history'
import { CommonService } from '@lib/common/common.service'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { Target } from './api-mission.interface'
import { FixedNumber } from 'ethers'
import { CAMPAIGN_IS_ACTIVE } from '@lib/campaign'

@Injectable()
export class ApiMissionService {
  constructor(
    private readonly missionService: MissionService,
    private readonly userRewardHistoryService: UserRewardHistoryService,
  ) {}

  async findAll(apiMissionFilterDto: ApiMissionFilterDto, userId: string) {
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
    const queryBuilder = this.missionQueryBuilder(apiMissionFilterDto, userId)
    const missions = await this.missionService.missionPaginate(
      options,
      queryBuilder,
      true,
    )

    // Empty missions
    if (missions.items.length === 0) {
      return {
        pagination: missions.meta,
        data: missions.items,
        links: CommonService.customLinks(missions.links),
      }
    }

    // Else missions not empty
    const missionIds = missions.items.map((m) => {
      return m.id
    })

    const receivedHistories =
      await this.userRewardHistoryService.getAmountByUser(missionIds, userId, [
        USER_REWARD_STATUS.AUTO_RECEIVED,
        USER_REWARD_STATUS.MANUAL_RECEIVED,
      ])
    const notReceivedHistories =
      await this.userRewardHistoryService.getAmountByUser(missionIds, userId, [
        USER_REWARD_STATUS.MANUAL_NOT_RECEIVE,
      ])

    return {
      pagination: missions.meta,
      data: missions.items.map((rawMission) => {
        const mission = plainToInstance(Mission, rawMission, {
          ignoreDecorators: true,
          //excludeExtraneousValues: false,
        })
        const money = this.getMoneyOfUser(
          JSON.parse(mission.grantTarget),
          mission.id,
          receivedHistories,
          notReceivedHistories,
          mission.limitReceivedReward,
        )
        delete mission.grantTarget
        return {
          ...instanceToPlain(mission, { exposeUnsetFields: false }),
          currency: money.currency,
          total_reward_amount: money.totalRewardAmount,
          received_amount: money.receivedAmount,
          not_received_amount: money.notReceivedAmount,
        }
      }),
      links: CommonService.customLinks(missions.links),
    }
  }

  private missionQueryBuilder(
    missionFilter: ApiMissionFilterDto,
    userId: string,
  ): SelectQueryBuilder<Mission> {
    const { searchField, searchText, sort, sortType } = missionFilter
    const queryBuilder = this.missionService.initQueryBuilder()
    queryBuilder.innerJoin(
      'campaigns',
      'campaigns',
      'campaigns.id = mission.campaign_id AND campaigns.is_active = ' +
        CAMPAIGN_IS_ACTIVE.ACTIVE,
    )
    queryBuilder.leftJoin(
      'mission_user',
      'mission_user',
      'mission_user.mission_id = mission.id AND mission_user.user_id = ' +
        userId,
    )
    queryBuilder.select([
      'mission_user.success_count AS success_count',
      'mission.title AS title',
      'mission.titleJp AS titleJp',
      'mission.id AS id',
      'mission.detailExplain AS detailExplain',
      'mission.detailExplainJp AS detailExplainJp',
      'mission.openingDate AS openingDate',
      'mission.closingDate AS closingDate',
      'mission.guideLink AS guideLink',
      'mission.guideLinkJp AS guideLinkJp',
      'mission.limitReceivedReward AS limitReceivedReward',
      'mission.grantTarget AS grantTarget',
      'mission.campaignId AS campaignId',
      'mission.status AS status',
      'IF (success_count >= mission.limitReceivedReward, true, false) AS completed', // Check if user completed this campaign
    ])
    queryBuilder.where('mission.isActive = :is_active ', {
      is_active: MISSION_IS_ACTIVE.ACTIVE,
    })
    queryBuilder.where('mission.targetType = :target_type ', {
      target_type: TARGET_TYPE.ONLY_MAIN,
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

  async getAmountEarned(userId: string) {
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
    const grantTargetObj = grantTarget as unknown as Target[]
    let currentTarget = null
    grantTargetObj.map((target) => {
      if (target.user === GRANT_TARGET_USER.USER) currentTarget = target
      return target
    })
    if (currentTarget === null) {
      return {
        currency: '',
        totalRewardAmount: '0',
        receivedAmount: '0',
        notReceivedAmount: '0',
        status: 1,
      }
    }
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
    }
  }
}
