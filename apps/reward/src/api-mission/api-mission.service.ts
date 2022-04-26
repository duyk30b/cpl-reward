import { Injectable } from '@nestjs/common'
import {
  DELIVERY_METHOD,
  GRANT_TARGET_USER,
  MISSION_IS_ACTIVE,
  MISSION_SEARCH_FIELD_MAP,
  MISSION_SORT_FIELD_MAP,
  MISSION_STATUS,
  MissionService,
  TARGET_TYPE,
  WALLET,
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
import { CAMPAIGN_IS_ACTIVE, CAMPAIGN_STATUS } from '@lib/campaign'
import { PaginateUserRewardHistory } from '@lib/user-reward-history/dto/paginate-user-reward-history.dto'

@Injectable()
export class ApiMissionService {
  constructor(
    private readonly missionService: MissionService,
    private readonly userRewardHistoryService: UserRewardHistoryService,
  ) {}

  async findPublicMissions(
    apiMissionFilterDto: ApiMissionFilterDto,
    userId: string,
  ) {
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
    const queryBuilder = this.missionsQueryBuilder(apiMissionFilterDto, userId)
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
      await this.userRewardHistoryService.getAmountByUser(
        missionIds,
        userId,
        USER_REWARD_STATUS.RECEIVED,
      )
    const notReceivedHistories =
      await this.userRewardHistoryService.getAmountByUser(
        missionIds,
        userId,
        USER_REWARD_STATUS.NOT_RECEIVE,
      )

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

        // TODO: Hiện chưa kịp code tách wallet với delivery method ra nên phải chế value cho FE
        if (money.wallet == 'DIRECT_CASHBACK') {
          money.wallet = WALLET.CASHBACK
          money.deliveryMethod = DELIVERY_METHOD.AUTO
        }
        if (money.wallet == 'DIRECT_BALANCE') {
          money.wallet = WALLET.BALANCE
          money.deliveryMethod = DELIVERY_METHOD.AUTO
        }
        return {
          ...instanceToPlain(mission, { exposeUnsetFields: false }),
          currency: money.currency,
          wallet: money.wallet,
          delivery_method: money.deliveryMethod,
          total_reward_amount: money.totalRewardAmount,
          received_amount: money.receivedAmount,
          not_received_amount: money.notReceivedAmount,
        }
      }),
      links: CommonService.customLinks(missions.links),
    }
  }

  private missionsQueryBuilder(
    missionFilter: ApiMissionFilterDto,
    userId: string,
  ): SelectQueryBuilder<Mission> {
    const { searchField, searchText, sort, sortType, grantTarget } =
      missionFilter
    const queryBuilder = this.missionService.initQueryBuilder()
    queryBuilder.innerJoin(
      'campaigns',
      'campaigns',
      'campaigns.id = mission.campaign_id AND campaigns.is_active = ' +
        CAMPAIGN_IS_ACTIVE.ACTIVE +
        ' AND campaigns.status = ' +
        CAMPAIGN_STATUS.RUNNING,
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
      'mission.titleJa AS titleJa',
      'mission.id AS id',
      'mission.isActive as isActive',
      'mission.detailExplain AS detailExplain',
      'mission.detailExplainJa AS detailExplainJa',
      'mission.openingDate AS openingDate',
      'mission.closingDate AS closingDate',
      'mission.guideLink AS guideLink',
      'mission.guideLinkJa AS guideLinkJa',
      'mission.limitReceivedReward AS limitReceivedReward',
      'mission.grantTarget AS grantTarget',
      'mission.campaignId AS campaignId',
      'mission.status AS status',
      'IF (success_count >= mission.limitReceivedReward, true, false) AS completed', // Check if user completed this campaign
    ])
    queryBuilder.where('mission.isActive = :is_active ', {
      is_active: MISSION_IS_ACTIVE.ACTIVE,
    })

    // Đoạn này cho phép front-end lấy số tiền mỗi user kiếm được, gom nhóm theo mission.
    // Truyền grantTarget lên để phân biệt tiền tự kiếm được hay từ affiliate
    // Tuy nhiên màn hình affiliate lại đang design kiểu history từng lần một, ko gom nhóm theo mission
    // Vì vậy đoạn GRANT_TARGET_USER.REFERRAL_USER này chưa đc gọi, để đây thôi
    if (!grantTarget || grantTarget === GRANT_TARGET_USER.USER) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('mission.targetType = ' + TARGET_TYPE.ONLY_MAIN).orWhere(
            'mission.targetType = ' + TARGET_TYPE.HYBRID,
          )
        }),
      )
    } else {
      // grantTarget === GRANT_TARGET_USER.REFERRAL_USER
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('mission.targetType = ' + TARGET_TYPE.ONLY_REFERRED).orWhere(
            'mission.targetType = ' + TARGET_TYPE.HYBRID,
          )
        }),
      )
    }

    // Only show running mission or completed by user
    queryBuilder.andWhere(
      new Brackets((qb) => {
        qb.where('mission.status = ' + MISSION_STATUS.RUNNING).orWhere(
          'success_count > 0',
        )
      }),
    )

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

  async getAffiliateEarned(userId: string) {
    return await this.userRewardHistoryService.getAffiliateEarned(userId)
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
        wallet: '',
        deliveryMethod: 112233,
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
      wallet: currentTarget.wallet,
      deliveryMethod: 112233,
      totalRewardAmount: totalRewardAmount.toString(),
      receivedAmount: receivedAmount.toString(),
      notReceivedAmount: notReceivedAmount.toString(),
    }
  }

  public getAffiliateDetailHistory(filter: PaginateUserRewardHistory) {
    return this.userRewardHistoryService.getAffiliateDetailHistory(filter)
  }
}
