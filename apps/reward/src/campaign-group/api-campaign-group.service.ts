import { Injectable } from '@nestjs/common'
import { ApiCreateCampaignGroupDto } from './dto/api-create-campaign-group.dto'
import { ApiUpdateCampaignGroupDto } from './dto/api-update-campaign-group.dto'
import { CampaignGroupService } from '@app/campaign-group'
import { ApiCreateCampaignDto } from '../campaign/dto/api-create-campaign.dto'
import { ApiUpdateCampaignDto } from '../campaign/dto/api-update-campaign.dto'

@Injectable()
export class ApiCampaignGroupService {
  constructor(private readonly campaignGroupService: CampaignGroupService) {}
  async create(apiCreateCampaignGroupDto: ApiCreateCampaignGroupDto) {
    return await this.campaignGroupService.create(apiCreateCampaignGroupDto)
  }

  async findOne(id: number) {
    return await this.campaignGroupService.getById(id)
  }

  async update(
    id: number,
    apiUpdateCampaignGroupDto: ApiUpdateCampaignGroupDto,
  ) {
    return await this.campaignGroupService.update({
      id,
      ...apiUpdateCampaignGroupDto,
    })
  }

  async findAll(page: number, limit: number) {
    limit = limit > 100 ? 100 : limit
    return this.campaignGroupService.paginate({
      page,
      limit,
    })
  }
}
