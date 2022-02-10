import { Injectable } from '@nestjs/common'
import { CampaignService } from '@app/campaign'

@Injectable()
export class ApiCampaignService {
  constructor(private readonly campaignService: CampaignService) {}

  async findAll(page: number, limit: number) {
    limit = limit > 100 ? 100 : limit
    return this.campaignService.paginate({
      page,
      limit,
    })
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
