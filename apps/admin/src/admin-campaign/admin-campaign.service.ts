import { Injectable } from '@nestjs/common'
import {
  CAMPAIGN_SEARCH_FIELD_MAP,
  CAMPAIGN_SORT_FIELD_MAP,
  CAMPAIGN_STATUS,
  CampaignService,
} from '@lib/campaign'
import { RewardRuleService } from '@lib/reward-rule'
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder'
import { Campaign } from '@lib/campaign/entities/campaign.entity'
import {
  ICampaignFilter,
  ICreateCampaign,
  IUpdateCampaign,
} from './admin-campaign.interface'
import { Brackets, In, LessThanOrEqual, MoreThanOrEqual, Not } from 'typeorm'
import { IPaginationMeta, PaginationTypeEnum } from 'nestjs-typeorm-paginate'
import { CustomPaginationMetaTransformer } from '@lib/common/transformers/custom-pagination-meta.transformer'
import { CommonService } from '@lib/common'
import * as moment from 'moment-timezone'
import { Interval } from '@nestjs/schedule'
import { InternationalPriceService } from '@lib/international-price'
import { MissionService } from '@lib/mission'

@Injectable()
export class AdminCampaignService {
  constructor(
    private readonly priceService: InternationalPriceService,
    private readonly campaignService: CampaignService,
    private readonly rewardRuleService: RewardRuleService,
    private readonly missionService: MissionService,
  ) {}

  @Interval(5000)
  async handleIntervalUpdateStatus() {
    const now = moment().unix()

    await this.campaignService.updateStatus(
      {
        endDate: LessThanOrEqual(now),
      },
      CAMPAIGN_STATUS.ENDED,
    )
    await this.campaignService.updateStatus(
      {
        startDate: LessThanOrEqual(now),
        endDate: MoreThanOrEqual(now),
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

  /**
   * Do not use below function to find one campaign yet
   */
  // async findOneOld(id: number) {
  //   const campaign = await this.campaignService.getById(id, {
  //     relations: ['rewardRules'],
  //   })
  //   if (!campaign) {
  //     return null
  //   }
  //   if (campaign.rewardRules !== undefined && campaign.rewardRules.length > 0) {
  //     campaign.rewardRules = campaign.rewardRules.filter(
  //       (item) => item.typeRule == TYPE_RULE.CAMPAIGN,
  //     )
  //   }
  //   return campaign
  // }

  async findOne(id: number) {
    return this.campaignService.getById(id)
  }

  /**
   * Do not use below function to create campaign yet
   */
  // async createOld(createCampaignInput: ICreateCampaign) {
  //   let campaign = await this.campaignService.create(createCampaignInput)
  //   await Promise.all(
  //     createCampaignInput.rewardRules.map(async (item) => {
  //       await this.rewardRuleService.create(item, {
  //         campaignId: campaign.id,
  //         missionId: null,
  //         typeRule: TYPE_RULE.CAMPAIGN,
  //       })
  //       return item
  //     }),
  //   )
  //   campaign = await this.campaignService.getById(campaign.id, {
  //     relations: ['rewardRules'],
  //   })
  //   campaign.rewardRules = campaign.rewardRules.filter(
  //     (item) => item.typeRule == TYPE_RULE.CAMPAIGN,
  //   )
  //   return campaign
  // }

  async create(create: ICreateCampaign) {
    create.status = AdminCampaignService.updateStatusCampaign(create)
    return await this.campaignService.create(create)
  }

  private static updateStatusCampaign(
    input: IUpdateCampaign | ICreateCampaign,
  ) {
    const now = moment().unix()
    if (now < input.startDate) return CAMPAIGN_STATUS.COMING_SOON
    if (input.startDate <= now && input.endDate >= now)
      return CAMPAIGN_STATUS.RUNNING
    if (now > input.endDate) return CAMPAIGN_STATUS.ENDED
  }

  /**
   * Do not use below function to update campaign yet
   */
  // async updateOld(updateCampaignInput: IUpdateCampaign) {
  //   let campaign = await this.campaignService.update(updateCampaignInput)
  //   await Promise.all(
  //     updateCampaignInput.rewardRules.map(async (item) => {
  //       await this.rewardRuleService.update(item, {
  //         campaignId: campaign.id,
  //         missionId: null,
  //         typeRule: TYPE_RULE.CAMPAIGN,
  //       })
  //       return item
  //     }),
  //   )
  //   campaign = await this.campaignService.getById(campaign.id, {
  //     relations: ['rewardRules'],
  //   })
  //   campaign.rewardRules = campaign.rewardRules.filter(
  //     (item) => item.typeRule == TYPE_RULE.CAMPAIGN,
  //   )
  //   return campaign
  // }

  async update(iUpdateCampaign: IUpdateCampaign) {
    const missions = await this.missionService.find({
      campaignId: iUpdateCampaign.id,
    })

    if (missions.length > 0) {
      const misionsOpeningDate = missions.map((mission) => mission.openingDate)
      const misionsClosingDate = missions.map((mission) => mission.closingDate)

      if (
        iUpdateCampaign.startDate > Math.min(...misionsOpeningDate) ||
        iUpdateCampaign.endDate < Math.max(...misionsClosingDate)
      ) {
        return {}
      }
    }

    iUpdateCampaign.status =
      AdminCampaignService.updateStatusCampaign(iUpdateCampaign)
    return await this.campaignService.update(iUpdateCampaign)
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
}
