import { Injectable } from '@nestjs/common'
import { CampaignService } from '@app/campaign'
import { ApiCreateCampaignDto } from './dto/api-create-campaign.dto'
import { ApiUpdateCampaignDto } from './dto/api-update-campaign.dto'

@Injectable()
export class ApiCampaignService {
  constructor(private readonly campaignService: CampaignService) {}

  async create(apiCreateCampaignDto: ApiCreateCampaignDto) {
    return await this.campaignService.create(apiCreateCampaignDto)
  }

  async findOne(id: number) {
    return await this.campaignService.getCampaignById(id)
  }

  async update(id: number, apiUpdateCampaignDto: ApiUpdateCampaignDto) {
    return await this.campaignService.update({ id, ...apiUpdateCampaignDto })
  }

  async findAll(page: number, limit: number) {
    limit = limit > 100 ? 100 : limit
    return this.campaignService.paginate({
      page,
      limit,
    })
  }
}
