import { Injectable } from '@nestjs/common'
import {
  CAMPAIGN_SEARCH_FIELD_MAP,
  CAMPAIGN_SORT_FIELD_MAP,
  CampaignService,
  IS_ACTIVE_CAMPAIGN,
  STATUS_CAMPAIGN,
} from '@lib/campaign'
import { KEY_REWARD_RULE, RewardRuleService, TYPE_RULE } from '@lib/reward-rule'
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder'
import { Campaign } from '@lib/campaign/entities/campaign.entity'
import {
  ICampaignFilter,
  ICreateCampaign,
  IUpdateCampaign,
} from './admin-campaign.interface'
import { Brackets } from 'typeorm'
import { IPaginationMeta, PaginationTypeEnum } from 'nestjs-typeorm-paginate'
import { CustomPaginationMetaTransformer } from '@lib/common/transformers/custom-pagination-meta.transformer'
import { CommonService } from '@lib/common'
import { CreateRewardRuleDto } from '@lib/reward-rule/dto/create-reward-rule.dto'

@Injectable()
export class AdminCampaignService {
  constructor(
    private readonly campaignService: CampaignService,
    private readonly rewardRuleService: RewardRuleService,
  ) {}

  async cancel(id: number): Promise<{ affected: number }> {
    const deleteResult = await this.campaignService.delete(id)
    return {
      affected: deleteResult.affected,
    }
  }

  async updateEndedStatus(now: number) {
    return this.campaignService.updateEndedStatus(now)
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
    create.status = AdminCampaignService.updateStatusByActive(create.isActive)
    const campaign = await this.campaignService.create(create)

    await Promise.all(
      Object.keys(KEY_REWARD_RULE).map(async (key) => {
        await this.rewardRuleService.create(
          {
            key: KEY_REWARD_RULE[key],
            currency: 'USDT',
            limitValue: '0',
            releaseValue: '0',
          } as CreateRewardRuleDto,
          {
            campaignId: campaign.id,
            missionId: null,
            typeRule: TYPE_RULE.CAMPAIGN,
          },
        )
      }),
    )
    return campaign
  }

  private static updateStatusByActive(isActive: number) {
    if (isActive === IS_ACTIVE_CAMPAIGN.ACTIVE) return STATUS_CAMPAIGN.RUNNING
    if (isActive === IS_ACTIVE_CAMPAIGN.INACTIVE)
      return STATUS_CAMPAIGN.INACTIVE
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
    iUpdateCampaign.status = AdminCampaignService.updateStatusByActive(
      iUpdateCampaign.isActive,
    )
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
      paginationType: PaginationTypeEnum.LIMIT_AND_OFFSET,
    }
    const queryBuilder = this.queryBuilder(campaignFilter)

    // TODO: Wrong totalItems count, due to this issue: https://github.com/nestjsx/nestjs-typeorm-paginate/issues/627
    // queryBuilder.leftJoinAndSelect(
    //   'campaign.rewardRules',
    //   'rewardRules',
    //   "rewardRules.type_rule = 'campaign'",
    // )

    const result = await this.campaignService.paginate(options, queryBuilder)
    return {
      pagination: result.meta,
      data: result.items,
      links: CommonService.customLinks(result.links),
    }
  }

  private queryBuilder(
    campaignFilter: ICampaignFilter,
  ): SelectQueryBuilder<Campaign> {
    const { searchField, searchText, sort, sortType } = campaignFilter
    const queryBuilder = this.campaignService.initQueryBuilder()
    queryBuilder.leftJoinAndSelect(
      'campaign.rewardRules',
      'rewardRules',
      "rewardRules.type_rule = 'campaign'",
    )
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
      queryBuilder.addOrderBy(CAMPAIGN_SORT_FIELD_MAP[sort], sortType || 'ASC')
    } else {
      queryBuilder.addOrderBy('campaign.priority', 'DESC')
      queryBuilder.addOrderBy('campaign.id', 'DESC')
    }

    return queryBuilder
  }

  private static escapeLikeChars(str: string) {
    return str.replace(/%/g, '\\%').replace(/_/g, '\\_')
  }
}
