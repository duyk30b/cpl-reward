import { Injectable } from '@nestjs/common'
import {
  CAMPAIGN_SEARCH_FIELD_MAP,
  CAMPAIGN_SORT_FIELD_MAP,
  CampaignService,
  IS_SYSTEM,
  IS_ACTIVE_CAMPAIGN,
} from '@lib/campaign'
import { ApiCampaignFilterDto } from './dto/api-campaign-filter.dto'
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder'
import { Campaign } from '@lib/campaign/entities/campaign.entity'
import { Brackets } from 'typeorm'
import { IPaginationMeta, PaginationTypeEnum } from 'nestjs-typeorm-paginate'
import { CustomPaginationMetaTransformer } from '@lib/common/transformers/custom-pagination-meta.transformer'
import { IPaginationOptions } from 'nestjs-typeorm-paginate/dist/interfaces'
import { CommonService } from '@lib/common'

@Injectable()
export class ApiCampaignService {
  constructor(private readonly campaignService: CampaignService) {}

  async findAll(apiCampaignFilterDto: ApiCampaignFilterDto) {
    const limit =
      (Number(apiCampaignFilterDto.limit) > 100
        ? 100
        : Number(apiCampaignFilterDto.limit)) || 20
    const page = apiCampaignFilterDto.page || 1
    const options: IPaginationOptions<CustomPaginationMetaTransformer> = {
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
    const queryBuilder = this.queryBuilder(apiCampaignFilterDto)
    const result = await this.campaignService.paginate(options, queryBuilder)
    CommonService.customLinks(result.links)
    return {
      pagination: result.meta,
      data: result.items,
      links: CommonService.customLinks(result.links),
    }
  }

  private queryBuilder(
    campaignFilter: ApiCampaignFilterDto,
  ): SelectQueryBuilder<Campaign> {
    const { searchField, searchText, sort, sortType } = campaignFilter
    const queryBuilder = this.campaignService.initQueryBuilder()
    queryBuilder.select([
      'campaign.id',
      'campaign.description',
      'campaign.descriptionJp',
      'campaign.title',
      'campaign.titleJp',
      'campaign.startDate',
      'campaign.endDate',
      'campaign.notificationLink',
      'campaign.notificationLinkJp',
      'campaign.campaignImage',
      'campaign.campaignImageJp',
    ])
    queryBuilder.where('campaign.isSystem = :is_system ', {
      is_system: IS_SYSTEM.FALSE,
    })
    queryBuilder.andWhere('campaign.isActive = :is_active ', {
      is_active: IS_ACTIVE_CAMPAIGN.ACTIVE,
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
      queryBuilder.orderBy(CAMPAIGN_SORT_FIELD_MAP[sort], sortType || 'ASC')
    } else {
      queryBuilder.orderBy('campaign.priority', 'DESC')
      queryBuilder.orderBy('campaign.id', 'DESC')
    }

    return queryBuilder
  }

  private static escapeLikeChars(str: string) {
    return str.replace(/%/g, '\\%').replace(/_/g, '\\_')
  }

  async findOne(id: number) {
    return this.campaignService.findOne({
      id,
      isActive: IS_ACTIVE_CAMPAIGN.ACTIVE,
      isSystem: IS_SYSTEM.FALSE,
    })
  }
}