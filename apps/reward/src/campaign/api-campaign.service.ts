import { Injectable } from '@nestjs/common'
import { CampaignService } from '@app/campaign'
import { IPaginationMeta } from 'nestjs-typeorm-paginate'
import { CustomPaginationMetaTransformer } from '@app/common/transformers/custom-pagination-meta.transformer'

@Injectable()
export class ApiCampaignService {
  constructor(private readonly campaignService: CampaignService) {}

  async findAll(page: number, limit: number) {
    limit = limit > 100 ? 100 : limit
    const options = {
      page,
      limit,
      metaTransformer: (
        meta: IPaginationMeta,
      ): CustomPaginationMetaTransformer =>
        new CustomPaginationMetaTransformer(
          meta.totalItems,
          meta.itemCount,
          meta.itemsPerPage,
          meta.totalPages,
          meta.currentPage,
        ),
    }
    return this.campaignService.snakePaginate(options)
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
