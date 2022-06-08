import { Injectable } from '@nestjs/common'
import {
  CAMPAIGN_SEARCH_FIELD_MAP,
  CAMPAIGN_SORT_FIELD_MAP,
  CAMPAIGN_STATUS,
  CampaignService,
  CAMPAIGN_IS_ACTIVE,
  CAMPAIGN_TYPE,
} from '@lib/campaign'
import { RewardRuleService } from '@lib/reward-rule'
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder'
import { Campaign } from '@lib/campaign/entities/campaign.entity'
import {
  ICampaignFilter,
  ICreateCampaign,
  IUpdateCampaign,
} from './admin-campaign.interface'
import { Brackets, In, LessThanOrEqual, MoreThan, Not } from 'typeorm'
import { IPaginationMeta, PaginationTypeEnum } from 'nestjs-typeorm-paginate'
import { CustomPaginationMetaTransformer } from '@lib/common/transformers/custom-pagination-meta.transformer'
import { CommonService, ErrorMessage, MissionUserLogStatus } from '@lib/common'
import { Interval } from '@nestjs/schedule'
import { InternationalPriceService } from '@lib/international-price'
import { DELIVERY_METHOD_WALLET, MissionService } from '@lib/mission'
import { MissionUserLogService } from '@lib/mission-user-log'
import {
  FilterCountRewardLogDto,
  MissingRewardsFilterDto,
  UpdateRewardLogDto,
} from './admin-campaign.dto'
import { plainToClass, plainToInstance } from 'class-transformer'
import { MissionUserFilterDto } from '@lib/mission-user-log/dto/mission-user-filter.dto'
import { UpdateMissionUserLogDto } from '@lib/mission-user-log/dto/update-mission-user-log.dto'
import {
  UserRewardHistoryService,
  USER_REWARD_STATUS,
} from '@lib/user-reward-history'
import {
  QueueService,
  QUEUE_SEND_BALANCE,
  QUEUE_SEND_CASHBACK,
} from '@lib/queue'
import {
  SendRewardToBalance,
  SendRewardToCashback,
} from 'apps/missions/src/interfaces/external.interface'

@Injectable()
export class AdminCampaignService {
  constructor(
    private readonly priceService: InternationalPriceService,
    private readonly campaignService: CampaignService,
    private readonly rewardRuleService: RewardRuleService,
    private readonly missionService: MissionService,
    private readonly missionUserLogService: MissionUserLogService,
    private readonly userRewardHistoryService: UserRewardHistoryService,
    private readonly queueService: QueueService,
  ) {}

  @Interval(5000)
  async handleIntervalUpdateStatus() {
    const now = CommonService.currentUnixTime()

    await this.campaignService.updateStatus(
      {
        endDate: LessThanOrEqual(now),
      },
      CAMPAIGN_STATUS.ENDED,
    )
    await this.campaignService.updateStatus(
      {
        startDate: LessThanOrEqual(now),
        endDate: MoreThan(now),
        status: Not(CAMPAIGN_STATUS.OUT_OF_BUDGET),
      },
      CAMPAIGN_STATUS.RUNNING,
    )
  }

  async cancel(id: number): Promise<{ affected: number }> {
    const deleteResult = await this.campaignService.delete(id)
    return {
      affected: deleteResult.affected,
    }
  }

  async findOne(id: number) {
    return this.campaignService.getById(id)
  }

  async create(create: ICreateCampaign) {
    create.status = AdminCampaignService.calcCampaignStatus(create)
    return await this.campaignService.create(create)
  }

  private static calcCampaignStatus(input: IUpdateCampaign | ICreateCampaign) {
    const now = CommonService.currentUnixTime()
    if (now < input.startDate) return CAMPAIGN_STATUS.COMING_SOON
    if (input.startDate <= now && input.endDate > now)
      return CAMPAIGN_STATUS.RUNNING
    if (now > input.endDate) return CAMPAIGN_STATUS.ENDED
  }

  async update(iUpdateCampaign: IUpdateCampaign) {
    const result = {
      message: '',
      success: true,
      campaign: {} as Campaign,
    }
    const missions = await this.missionService.find({
      campaignId: iUpdateCampaign.id,
    })

    if (missions.length > 0) {
      const missionsOpeningDate = missions.map((mission) => mission.openingDate)
      const missionsClosingDate = missions.map((mission) => mission.closingDate)

      if (
        iUpdateCampaign.startDate > Math.min(...missionsOpeningDate) ||
        iUpdateCampaign.endDate < Math.max(...missionsClosingDate)
      ) {
        result.success = false
        result.message = ErrorMessage.INVALID_CAMPAIGN_TIME
        return result
      }
    }

    iUpdateCampaign.status =
      AdminCampaignService.calcCampaignStatus(iUpdateCampaign)
    const updateResult = await this.campaignService.update(iUpdateCampaign)

    if (updateResult.affected === 0) {
      result.success = false
      result.message = ErrorMessage.INVALID_CAMPAIGN_TYPE
      result.campaign = await this.campaignService.findOne({
        isActive: CAMPAIGN_IS_ACTIVE.ACTIVE,
        type: CAMPAIGN_TYPE.ORDER,
      })
      return result
    }

    result.campaign = await this.campaignService.findOne({
      id: iUpdateCampaign.id,
    })

    if (result.campaign.type === CAMPAIGN_TYPE.ORDER) {
      this.missionService.updateMissionPeriod(result.campaign)
    }

    return result
  }

  async findAll(campaignFilter: ICampaignFilter) {
    const limit =
      (campaignFilter.limit > 100 ? 100 : campaignFilter.limit) || 20
    const page = campaignFilter.page || 1
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
      route: '/campaigns',
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
    }
    const queryBuilder = this.queryBuilder(campaignFilter)
    const campaigns = await this.campaignService.getPaginate(
      options,
      queryBuilder,
    )

    // Join reward_rules. Get unique campaignIds
    const campaignIds = Array.from(
      new Set(
        campaigns.items.map((x) => {
          return x.id
        }),
      ),
    )
    // Map rewardRules with campaign
    const rewardRules = await this.rewardRuleService.find({
      where: { campaignId: In(campaignIds) },
    })

    const currencies = rewardRules.map((rule) => rule.currency)
    const prices = await this.getCoinPrice(currencies)

    for (let i = 0; i < campaigns.items.length; i++) {
      campaigns.items[i].rewardRules = rewardRules.filter(
        (c) => c.campaignId === campaigns.items[i].id,
      )
    }

    return {
      pagination: campaigns.meta,
      data: campaigns.items,
      links: CommonService.customLinks(campaigns.links),
      prices,
    }
  }

  private queryBuilder(
    campaignFilter: ICampaignFilter,
  ): SelectQueryBuilder<Campaign> {
    const { searchField, searchText, sort, sortType } = campaignFilter
    const queryBuilder = this.campaignService.initQueryBuilder()
    queryBuilder.addSelect('campaign.*')
    if (searchText) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          if (searchField && CAMPAIGN_SEARCH_FIELD_MAP[searchField]) {
            qb.where(`${CAMPAIGN_SEARCH_FIELD_MAP[searchField]} LIKE :keyword`)
          } else {
            Object.keys(CAMPAIGN_SEARCH_FIELD_MAP).forEach((field) => {
              qb.orWhere(`${CAMPAIGN_SEARCH_FIELD_MAP[field]} LIKE :keyword`)
            })
          }
        }),
        {
          keyword: `%${AdminCampaignService.escapeLikeChars(searchText)}%`,
        },
      )
    }

    if (sort && CAMPAIGN_SORT_FIELD_MAP[sort]) {
      queryBuilder.orderBy(CAMPAIGN_SORT_FIELD_MAP[sort], sortType || 'ASC')
    } else {
      queryBuilder.orderBy('campaign.priority', 'DESC')
      queryBuilder.addOrderBy('campaign.id', 'DESC')
    }

    return queryBuilder
  }

  private static escapeLikeChars(str: string) {
    return str.replace(/%/g, '\\%').replace(/_/g, '\\_')
  }

  private async getCoinPrice(currencies: Array<string>) {
    const currencyPriceQueries = []
    const queriedCurrencies = ['USDT']

    currencies.forEach((currency) => {
      if (queriedCurrencies.includes(currency)) {
        return
      }

      queriedCurrencies.push(currency)
      currencyPriceQueries.push(this.priceService.getPriceInUsdt(currency))
    })

    const result = await Promise.allSettled(currencyPriceQueries)
    const fulfilledResult = result.filter(
      (res) => res.status === 'fulfilled',
    ) as PromiseFulfilledResult<any>[]
    return fulfilledResult.map((res) => ({
      currency: [res?.value?.coin?.toUpperCase()],
      price: res?.value?.price,
    }))
  }

  async getMissingRewards(input: MissingRewardsFilterDto) {
    return await this.missionUserLogService.getList(input)
  }

  async updateRewardLog(input: UpdateRewardLogDto) {
    const transformedInput = plainToClass(UpdateMissionUserLogDto, input, {
      ignoreDecorators: true,
    })

    const missionUserLog = await this.missionUserLogService.findOne(input.id)
    if (
      input.status === MissionUserLogStatus.RETRYING &&
      missionUserLog.status !== MissionUserLogStatus.NEED_TO_RESOLVE
    ) {
      return {
        success: false,
      }
    }

    const result = await this.missionUserLogService.update(
      input.id,
      transformedInput,
    )

    if (input.status !== MissionUserLogStatus.RESOLVED) {
      // Retry for missing reward
      if (input.status === MissionUserLogStatus.RETRYING && result.affected) {
        const rewardHistory = await this.userRewardHistoryService.findOne(
          missionUserLog.rewardHistoryId,
        )

        if (missionUserLog.wallet === DELIVERY_METHOD_WALLET.DIRECT_BALANCE) {
          const balanceBody = plainToInstance(SendRewardToBalance, {
            id: missionUserLog.rewardHistoryId,
            userId: missionUserLog.userId,
            amount: missionUserLog.moneyEarned,
            currency: missionUserLog.currency,
            historyId: missionUserLog.rewardHistoryId,
            userType: missionUserLog.userType,
            referenceId: rewardHistory.referenceId,
            missionUserLogId: missionUserLog.id,
            type: 'reward',
          })
          await this.queueService.addSendMoneyJob(
            missionUserLog.userId,
            QUEUE_SEND_BALANCE,
            0,
            balanceBody,
          )
        }

        if (missionUserLog.wallet === DELIVERY_METHOD_WALLET.DIRECT_CASHBACK) {
          const cashbackBody = plainToInstance(SendRewardToCashback, {
            id: missionUserLog.rewardHistoryId,
            userId: missionUserLog.userId,
            amount: missionUserLog.moneyEarned,
            currency: missionUserLog.currency,
            userType: missionUserLog.userType,
            referenceId: rewardHistory.referenceId,
            missionUserLogId: missionUserLog.id,
            type: 'reward',
          })
          await this.queueService.addSendMoneyJob(
            missionUserLog.userId,
            QUEUE_SEND_CASHBACK,
            0,
            cashbackBody,
          )
        }
      }

      return {
        success: result.affected > 0,
      }
    }

    if (missionUserLog.rewardHistoryId) {
      await this.userRewardHistoryService.updateById(
        missionUserLog.rewardHistoryId,
        {
          status: USER_REWARD_STATUS.RECEIVED,
        },
      )
    }

    return {
      success: result.affected > 0,
    }
  }

  async countRewardLog(input: FilterCountRewardLogDto) {
    const filter = plainToClass(MissionUserFilterDto, input, {
      ignoreDecorators: true,
    })

    const count = await this.missionUserLogService.count(filter)
    return { count }
  }
}
