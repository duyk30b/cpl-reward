import { Injectable } from '@nestjs/common'
import {
  CAMPAIGN_SEARCH_FIELD_MAP,
  CAMPAIGN_SORT_FIELD_MAP,
  CampaignService,
  IS_SYSTEM,
  STATUS,
} from '@lib/campaign'
import { ApiCampaignFilterDto } from './dto/api-campaign-filter.dto'
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder'
import { Campaign } from '@lib/campaign/entities/campaign.entity'
import { Brackets } from 'typeorm'

@Injectable()
export class ApiCampaignService {
  constructor(private readonly campaignService: CampaignService) {}

  async findAll(apiCampaignFilterDto: ApiCampaignFilterDto) {
    const limit =
      (apiCampaignFilterDto.limit > 100 ? 100 : apiCampaignFilterDto.limit) ||
      20
    const page = apiCampaignFilterDto.page || 1
    const options = {
      page,
      limit,
    }
    const queryBuilder = this.queryBuilder(apiCampaignFilterDto)
    return this.campaignService.snakePaginate(options, queryBuilder)
  }

  private queryBuilder(
    campaignFilter: ApiCampaignFilterDto,
  ): SelectQueryBuilder<Campaign> {
    const { searchField, searchText, sort, sortType } = campaignFilter
    const queryBuilder = this.campaignService.initQueryBuilder()
    queryBuilder.where('campaign.isSystem = :is_system ', {
      is_system: IS_SYSTEM.FALSE,
    })
    queryBuilder.andWhere('campaign.status = :status ', {
      status: `${STATUS.ACTIVE}`,
    })
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
          keyword: `%${ApiCampaignService.escapeLikeChars(searchText)}%`,
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

  async findOne(id: number) {
    const campaign = await this.campaignService.getById(id, {
      relations: ['rewardRules'],
    })
    if (!campaign) {
      return null
    }
    if (campaign.rewardRules.length > 0) {
      campaign.rewardRules = campaign.rewardRules.filter(
        (item) => item.typeRule == 'campaign',
      )
    }
    return campaign
  }
}
