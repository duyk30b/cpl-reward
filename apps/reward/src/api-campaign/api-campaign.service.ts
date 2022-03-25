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
      'campaign.title',
      'campaign.id',
      'campaign.description',
      'campaign.detailExplain',
      'campaign.notificationLink',
      'campaign.campaignImage',
      'campaign.startDate',
      'campaign.endDate',
    ])
    queryBuilder.where('campaign.isSystem = :is_system ', {
      is_system: IS_SYSTEM.FALSE,
    })
    queryBuilder.andWhere('campaign.status = :status ', {
      status: STATUS.ACTIVE,
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

  // async findOne(id: number) {
  //   const campaign = await this.campaignService.getById(id, {
  //     relations: ['rewardRules'],
  //   })
  //   if (!campaign) {
  //     return null
  //   }
  //   if (campaign.rewardRules.length > 0) {
  //     campaign.rewardRules = campaign.rewardRules.filter(
  //       (item) => item.typeRule == 'campaign',
  //     )
  //   }
  //   return campaign
  // }
}
