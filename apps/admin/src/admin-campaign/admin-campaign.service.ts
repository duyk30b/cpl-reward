import { Injectable } from '@nestjs/common'
import {
  CAMPAIGN_SEARCH_FIELD_MAP,
  CAMPAIGN_SORT_FIELD_MAP,
  CampaignService,
} from '@lib/campaign'
import { RewardRuleService } from '@lib/reward-rule'
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder'
import { Campaign } from '@lib/campaign/entities/campaign.entity'
import {
  CreateCampaignInput,
  ICampaignFilter,
  UpdateCampaignInput,
} from './admin-campaign.interface'
import { Brackets } from 'typeorm'
import { IPaginationMeta, PaginationTypeEnum } from 'nestjs-typeorm-paginate'
import { CustomPaginationMetaCamelTransformer } from '@lib/common/transformers/custom-pagination-meta.transformer'

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

  async findOne(id: number) {
    const campaign = await this.campaignService.getById(id, {
      relations: ['rewardRules'],
    })
    if (!campaign) {
      return null
    }
    if (campaign.rewardRules !== undefined && campaign.rewardRules.length > 0) {
      campaign.rewardRules = campaign.rewardRules.filter(
        (item) => item.typeRule == 'campaign',
      )
    }
    return campaign
  }

  async create(createCampaignInput: CreateCampaignInput) {
    let campaign = await this.campaignService.create(createCampaignInput)
    await Promise.all(
      createCampaignInput.rewardRules.map(async (item) => {
        await this.rewardRuleService.create(item, {
          campaignId: campaign.id,
          missionId: null,
          typeRule: 'campaign',
        })
        return item
      }),
    )
    campaign = await this.campaignService.getById(campaign.id, {
      relations: ['rewardRules'],
    })
    campaign.rewardRules = campaign.rewardRules.filter(
      (item) => item.typeRule == 'campaign',
    )
    return campaign
  }

  async update(updateCampaignInput: UpdateCampaignInput) {
    let campaign = await this.campaignService.update(updateCampaignInput)
    await Promise.all(
      updateCampaignInput.rewardRules.map(async (item) => {
        await this.rewardRuleService.update(item, {
          campaignId: campaign.id,
          missionId: null,
          typeRule: 'campaign',
        })
        return item
      }),
    )
    campaign = await this.campaignService.getById(campaign.id, {
      relations: ['rewardRules'],
    })
    campaign.rewardRules = campaign.rewardRules.filter(
      (item) => item.typeRule == 'campaign',
    )
    return campaign
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
      ): CustomPaginationMetaCamelTransformer =>
        new CustomPaginationMetaCamelTransformer(
          pagination.totalItems,
          pagination.itemsPerPage,
          pagination.currentPage,

          pagination.itemCount,
          pagination.totalPages,
        ),
      route: '/campaigns',
      paginationType: PaginationTypeEnum.LIMIT_AND_OFFSET,
    }
    const queryBuilder = this.queryBuilder(campaignFilter)
    const result = await this.campaignService.grpcPaginate(
      options,
      queryBuilder,
    )
    return {
      pagination: result.meta,
      data: result.items,
      links: result.links,
    }
  }

  private queryBuilder(
    campaignFilter: ICampaignFilter,
  ): SelectQueryBuilder<Campaign> {
    const { searchField, searchText, sort, sortType } = campaignFilter
    const queryBuilder = this.campaignService.initQueryBuilder()
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
      queryBuilder
        .orderBy(CAMPAIGN_SORT_FIELD_MAP[sort], sortType || 'ASC')
        .addOrderBy('campaign.priority', 'DESC')
        .addOrderBy('campaign.id', 'DESC')
    } else {
      queryBuilder
        .orderBy('campaign.priority', 'DESC')
        .addOrderBy('campaign.id', 'DESC')
    }

    return queryBuilder
  }

  private static escapeLikeChars(str: string) {
    return str.replace(/%/g, '\\%').replace(/_/g, '\\_')
  }
}
