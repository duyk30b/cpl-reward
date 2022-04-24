import { Injectable } from '@nestjs/common'
import {
  CAMPAIGN_SEARCH_FIELD_MAP,
  CAMPAIGN_SORT_FIELD_MAP,
  CampaignService,
  CAMPAIGN_IS_SYSTEM,
  CAMPAIGN_IS_ACTIVE,
  CAMPAIGN_STATUS,
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

  async findPublicCampaigns(
    apiCampaignFilterDto: ApiCampaignFilterDto,
    userId: string,
  ) {
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
    const queryBuilder = this.campaignQueryBuilder(apiCampaignFilterDto, userId)
    const result = await this.campaignService.getPaginate(
      options,
      queryBuilder,
      false,
    )
    CommonService.customLinks(result.links)
    return {
      pagination: result.meta,
      data: result.items,
      links: CommonService.customLinks(result.links),
    }
  }

  private campaignQueryBuilder(
    campaignFilter: ApiCampaignFilterDto,
    userId: string,
  ): SelectQueryBuilder<Campaign> {
    const { searchField, searchText, sort, sortType } = campaignFilter
    const queryBuilder = this.campaignService.initQueryBuilder()
    queryBuilder.leftJoin(
      'mission_user',
      'mission_user',
      'mission_user.campaign_id = campaign.id AND mission_user.user_id = ' +
        userId +
        ' AND (SELECT missions.is_active FROM missions WHERE missions.id = mission_user.mission_id AND is_active = true LIMIT 0,1) IS NOT NULL',
    )
    queryBuilder.select([
      'mission_user.success_count AS success_count',
      'campaign.id',
      'campaign.description',
      'campaign.descriptionJa',
      'campaign.title',
      'campaign.titleJa',
      'campaign.startDate',
      'campaign.endDate',
      'campaign.notificationLink',
      'campaign.notificationLinkJa',
      'campaign.campaignImage',
      'campaign.campaignImageJa',
      'campaign.status',
    ])
    queryBuilder.where('campaign.isSystem = :is_system ', {
      is_system: CAMPAIGN_IS_SYSTEM.FALSE,
    })
    queryBuilder.andWhere('campaign.isActive = :is_active ', {
      is_active: CAMPAIGN_IS_ACTIVE.ACTIVE,
    })

    // Only show running campaign or completed by user
    queryBuilder.andWhere(
      new Brackets((qb) => {
        qb.where('campaign.status = ' + CAMPAIGN_STATUS.RUNNING).orWhere(
          'success_count > 0',
        )
      }),
    )

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
      queryBuilder.addOrderBy('campaign.id', 'DESC')
    }

    return queryBuilder
  }

  private static escapeLikeChars(str: string) {
    return str.replace(/%/g, '\\%').replace(/_/g, '\\_')
  }

  async findOne(id: number) {
    return this.campaignService.findOne({
      id,
      isActive: CAMPAIGN_IS_ACTIVE.ACTIVE,
      isSystem: CAMPAIGN_IS_SYSTEM.FALSE,
    })
  }
}
