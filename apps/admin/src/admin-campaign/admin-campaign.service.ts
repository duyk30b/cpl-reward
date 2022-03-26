import { Injectable } from '@nestjs/common'
import {
  CAMPAIGN_SEARCH_FIELD_MAP,
  CAMPAIGN_SORT_FIELD_MAP,
  CampaignService,
  IS_ACTIVE_CAMPAIGN,
  STATUS_CAMPAIGN,
} from '@lib/campaign'
// import { RewardRuleService, TYPE_RULE } from '@lib/reward-rule'
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder'
import { Campaign } from '@lib/campaign/entities/campaign.entity'
import {
  CreateCampaignInput,
  ICampaignFilter,
  UpdateCampaignInput,
} from './admin-campaign.interface'
import { Brackets } from 'typeorm'
import { IPaginationMeta, PaginationTypeEnum } from 'nestjs-typeorm-paginate'
import { CustomPaginationMetaTransformer } from '@lib/common/transformers/custom-pagination-meta.transformer'
import { CommonService } from '@lib/common'

@Injectable()
export class AdminCampaignService {
  constructor(
    private readonly campaignService: CampaignService, // private readonly rewardRuleService: RewardRuleService,
  ) {}

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
  // async createOld(createCampaignInput: CreateCampaignInput) {
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

  async create(createCampaignInput: CreateCampaignInput) {
    // if (createCampaignInput.isActive === IS_ACTIVE_CAMPAIGN.ACTIVE)
    //   createCampaignInput.status = STATUS_CAMPAIGN.RUNNING
    // if (createCampaignInput.isActive === IS_ACTIVE_CAMPAIGN.INACTIVE)
    //   createCampaignInput.status = STATUS_CAMPAIGN.ENDED
    return await this.campaignService.create(createCampaignInput)
  }

  /**
   * Do not use below function to update campaign yet
   */
  // async updateOld(updateCampaignInput: UpdateCampaignInput) {
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

  async update(updateCampaignInput: UpdateCampaignInput) {
    return await this.campaignService.update(updateCampaignInput)
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

    if (!sort || sort !== 'priority')
      queryBuilder.addOrderBy('campaign.priority', 'DESC')

    if (!sort || sort !== 'id') queryBuilder.addOrderBy('campaign.id', 'DESC')

    if (sort && CAMPAIGN_SORT_FIELD_MAP[sort])
      queryBuilder.addOrderBy(CAMPAIGN_SORT_FIELD_MAP[sort], sortType || 'ASC')

    return queryBuilder
  }

  private static escapeLikeChars(str: string) {
    return str.replace(/%/g, '\\%').replace(/_/g, '\\_')
  }
}
