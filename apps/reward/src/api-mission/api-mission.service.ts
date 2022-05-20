import { Injectable, Logger } from '@nestjs/common'
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
import {
  USER_REWARD_STATUS,
  UserRewardHistoryService,
} from '@lib/user-reward-history'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { Target } from './api-mission.interface'
import { FixedNumber } from 'ethers'
import { CAMPAIGN_IS_ACTIVE, CAMPAIGN_STATUS } from '@lib/campaign'
import { PaginateUserRewardHistory } from '@lib/user-reward-history/dto/paginate-user-reward-history.dto'
import { IUserCondition } from '../../../missions/src/interfaces/missions.interface'
import { ExternalUserService } from '@lib/external-user'
import { IPaginationMeta, PaginationTypeEnum } from 'nestjs-typeorm-paginate'
import { CustomPaginationMetaTransformer } from '@lib/common/transformers/custom-pagination-meta.transformer'
import {
  QueueService,
  QUEUE_SEND_BALANCE,
  QUEUE_SEND_CASHBACK,
} from '@lib/queue'
import { UserRewardHistory } from '@lib/user-reward-history/entities/user-reward-history.entity'
import {
  SendRewardToBalance,
  SendRewardToCashback,
} from 'apps/missions/src/interfaces/external.interface'

@Injectable()
export class ApiMissionService {
  private readonly logger = new Logger(ApiMissionService.name)

  constructor(
    private readonly missionService: MissionService,
    private readonly userRewardHistoryService: UserRewardHistoryService,
    private readonly externalUserService: ExternalUserService,
    private readonly queueService: QueueService,
  ) {}

  async findPublicMissions(
    apiMissionFilterDto: ApiMissionFilterDto,
    userId: string,
  ) {
    apiMissionFilterDto.limit =
      (apiMissionFilterDto.limit > 100 ? 100 : apiMissionFilterDto.limit) || 20
    apiMissionFilterDto.fromId = Math.max(
      apiMissionFilterDto.fromId ? apiMissionFilterDto.fromId : 1,
      1,
    )

    let data = []
    const user = await this.externalUserService.getUserInfo(userId)
    if (!user) {
      this.logger.warn('Cannot find user by ID: ' + userId)
      return null
    }

    let missions = []
    do {
      const page = apiMissionFilterDto.fromId
      const limit = apiMissionFilterDto.limit
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
      const queryBuilder = this.missionsQueryBuilder(
        apiMissionFilterDto,
        userId,
      )
      const queryResults = await this.missionService.missionPaginate(
        options,
        queryBuilder,
        true,
      )
      missions = queryResults.items
      apiMissionFilterDto.fromId++

      // let missions = queryBuilder.getRawMany()

      // Empty missions
      if (!missions || missions.length === 0) {
        break
      }

      // Lọc bớt các mission chưa completed mà ko đủ điều kiện hiển thị
      missions = missions.filter(
        (m) =>
          m.completed ||
          !m.displayConditions ||
          this.missionService.checkUserConditions(
            JSON.parse(m.displayConditions) as unknown as IUserCondition[],
            user,
          ),
      )

      if (missions.length === 0) {
        continue
      }

      // Else missions not empty
      const missionIds = missions.map((m) => {
        return m.id
      })

      const rewardHistories =
        await this.userRewardHistoryService.getUserRewardHistoryByMissionsId(
          missionIds,
          userId,
        )

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
          USER_REWARD_STATUS.NEED_TO_REDEEM,
        )

      const newData = missions.map((rawMission) => {
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
        delete mission.displayConditions

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
          reward_status: this.getMissionRewardStatus(
            rewardHistories,
            mission.id,
          ),
        }
      })
      data = data.concat(newData)

      // Data.push cac missionExtras thoa man
      if (data.length >= apiMissionFilterDto.limit) {
        break
      }
    } while (true)

    // Return
    let nextLink = ''
    const prevLink = ''

    if (data.length > 0) {
      nextLink = new URLSearchParams(
        instanceToPlain(apiMissionFilterDto, {
          exposeUnsetFields: false,
        }),
      ).toString()
    }

    return {
      data: data,
      links: {
        next: nextLink,
        prev: prevLink,
      },
    }
  }

  private missionsQueryBuilder(
    missionFilter: ApiMissionFilterDto,
    userId: string,
  ): SelectQueryBuilder<Mission> {
    const { searchField, searchText, sort, sortType } = missionFilter
    let { grantTarget } = missionFilter
    if (!grantTarget) {
      grantTarget = GRANT_TARGET_USER.USER
    }
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
        userId +
        ' AND mission_user.user_type = "' +
        grantTarget +
        '"',
    )

    // Đoạn này dùng để kiểm tra user có bị trả thưởng xịt do lỗi hệ thống ko
    // Tuy nhiên nếu sau này 1 user đc nhận nhiều lần trong 1 mission
    // Sẽ phát sinh vấn đề là có history thành công / chờ bấm nút redeem / gửi thất bại
    // Thì chưa biết ưu tiên hiển thị cái gì, cũng cần lưu ý đoạn left join này đang chỉ query status = FAIL
    // queryBuilder.leftJoin(
    //   'user_reward_histories',
    //   'user_reward_histories',
    //   'user_reward_histories.mission_id = mission.id AND user_reward_histories.user_id = ' +
    //     userId +
    //     ' AND user_reward_histories.status = ' +
    //     USER_REWARD_STATUS.FAIL,
    // )
    queryBuilder.select([
      'mission_user.success_count AS success_count',
      'mission.title AS title',
      'mission.titleJa AS titleJa',
      'mission.id AS id',
      'mission.priority AS priority',
      'mission.isActive as isActive',
      'mission.detailExplain AS detailExplain',
      'mission.detailExplainJa AS detailExplainJa',
      'mission.openingDate AS openingDate',
      'mission.closingDate AS closingDate',
      'mission.guideLink AS guideLink',
      'mission.guideLinkJa AS guideLinkJa',
      'mission.limitReceivedReward AS limitReceivedReward',
      'mission.grantTarget AS grantTarget',
      'mission.displayConditions AS displayConditions',
      'mission.campaignId AS campaignId',
      'mission.status AS status',
      'IF (success_count >= mission.limitReceivedReward, true, false) AS completed', // Check if user completed this campaign
      //  'user_reward_histories.status AS reward_status',
    ])
    queryBuilder.where('mission.isActive = :is_active ', {
      is_active: MISSION_IS_ACTIVE.ACTIVE,
    })

    // Đoạn này cho phép front-end lấy số tiền mỗi user kiếm được, gom nhóm theo mission.
    // Truyền grantTarget lên để phân biệt tiền tự kiếm được hay từ affiliate
    // Tuy nhiên màn hình affiliate lại đang design kiểu history từng lần một, ko gom nhóm theo mission
    // Vì vậy đoạn GRANT_TARGET_USER.REFERRAL_USER này chưa đc gọi, để đây thôi
    if (grantTarget === GRANT_TARGET_USER.USER) {
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
        qb.where(
          new Brackets((qbc) => {
            qbc
              .where('mission.status = ' + MISSION_STATUS.RUNNING)
              .andWhere('campaigns.status = ' + CAMPAIGN_STATUS.RUNNING)
          }),
        ).orWhere('success_count > 0')
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

    // TODO: Vì lý do
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

    queryBuilder.limit(missionFilter.limit)

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
      // deliveryMethod: 112233,
      totalRewardAmount: totalRewardAmount.toString(),
      receivedAmount: receivedAmount.toString(),
      notReceivedAmount: notReceivedAmount.toString(),
    }
  }

  public getAffiliateDetailHistory(filter: PaginateUserRewardHistory) {
    return this.userRewardHistoryService.getAffiliateDetailHistory(filter)
  }

  public async requestRedeemMission(missionId: number, userId: string) {
    const rewardHistories = await this.userRewardHistoryService.find({
      missionId: missionId,
      userId: userId,
      status: USER_REWARD_STATUS.NEED_TO_REDEEM,
    })

    const proccessList = rewardHistories.map((history) =>
      this.processRedeemReward(history),
    )

    const result = await Promise.allSettled(proccessList)

    return result.some(
      (item) => (item as any).value && item.status === 'fulfilled',
    )
  }

  public async processRedeemReward(rewardHistory: UserRewardHistory) {
    const updated = await this.userRewardHistoryService.updateStatus(
      rewardHistory.id,
      USER_REWARD_STATUS.PROCESSING_REDEEM,
    )

    if (!updated.affected) {
      return false
    }

    if (rewardHistory.wallet === WALLET.BALANCE) {
      const balanceBody = plainToInstance(SendRewardToCashback, {
        id: rewardHistory.id,
        userId: rewardHistory.userId,
        amount: rewardHistory.amount,
        currency: rewardHistory.currency,
        historyId: rewardHistory.id,
        userType: rewardHistory.userType,
        referenceId: rewardHistory.referenceId,
        missionUserLogId: rewardHistory.id,
      })
      await this.queueService.addSendMoneyJob(
        rewardHistory.userId,
        QUEUE_SEND_BALANCE,
        0,
        balanceBody,
      )
    }

    if (rewardHistory.wallet === WALLET.CASHBACK) {
      const cashbackBody = plainToInstance(SendRewardToBalance, {
        id: rewardHistory.id,
        userId: rewardHistory.userId,
        amount: rewardHistory.amount,
        currency: rewardHistory.currency,
        userType: rewardHistory.userType,
        referenceId: rewardHistory.referenceId,
        missionUserLogId: rewardHistory.id,
        type: 'reward',
      })
      await this.queueService.addSendMoneyJob(
        rewardHistory.userId,
        QUEUE_SEND_CASHBACK,
        0,
        cashbackBody,
      )
    }

    return true
  }

  getMissionRewardStatus(
    rewardHistories: Array<UserRewardHistory>,
    missionId: number,
  ) {
    const needRedeem = rewardHistories.some(
      (item) =>
        item.missionId === missionId &&
        item.status === USER_REWARD_STATUS.NEED_TO_REDEEM,
    )
    if (needRedeem) {
      return USER_REWARD_STATUS.NEED_TO_REDEEM
    }

    const processingRedeem = rewardHistories.some(
      (item) =>
        item.missionId === missionId &&
        [
          USER_REWARD_STATUS.PROCESSING_REDEEM,
          USER_REWARD_STATUS.DEFAULT_STATUS,
        ].includes(item.status),
    )
    if (processingRedeem) {
      return USER_REWARD_STATUS.PROCESSING_REDEEM
    }

    const isFailed = rewardHistories.some(
      (item) =>
        item.missionId === missionId && item.status === USER_REWARD_STATUS.FAIL,
    )
    if (isFailed) {
      return USER_REWARD_STATUS.FAIL
    }

    const isReceived = rewardHistories.some(
      (item) =>
        item.missionId === missionId &&
        item.status === USER_REWARD_STATUS.RECEIVED,
    )
    if (isReceived) {
      return USER_REWARD_STATUS.RECEIVED
    }

    return null
  }
}
