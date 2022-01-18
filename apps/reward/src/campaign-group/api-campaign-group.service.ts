import { Injectable } from '@nestjs/common'
import { ApiCreateCampaignGroupDto } from './dto/api-create-campaign-group.dto'
import { ApiUpdateCampaignGroupDto } from './dto/api-update-campaign-group.dto'
import { CampaignGroupService } from '@app/campaign-group'
import { ApiMapCampaignGroupDto } from './dto/api-map-campaign-group.dto'
import { CampaignService } from '@app/campaign'

@Injectable()
export class ApiCampaignGroupService {
  constructor(
    private readonly campaignGroupService: CampaignGroupService,
    private readonly campaignService: CampaignService,
  ) {}

  async create(apiCreateCampaignGroupDto: ApiCreateCampaignGroupDto) {
    return await this.campaignGroupService.create(apiCreateCampaignGroupDto)
  }

  async findOne(id: number) {
    const campaignGroup = await this.campaignGroupService.getById(id)
    if (!campaignGroup) {
      return null
    }

    const mapCampaigns = await this.campaignGroupService.getMapsByGroupId(
      campaignGroup.id,
    )

    const campaignIds = mapCampaigns.map((m) => {
      return m.campaignId
    })

    const campaigns = await this.campaignService.getByIds(campaignIds)

    return { campaignGroup, campaigns }
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

  async mapCampaigns(apiMapCampaignGroupDto: ApiMapCampaignGroupDto) {
    return await this.campaignGroupService.mapCampaigns(
      apiMapCampaignGroupDto.id,
      apiMapCampaignGroupDto.campaignIds,
    )
  }

  async unmapCampaigns(apiMapCampaignGroupDto) {
    return await this.campaignGroupService.unmapCampaigns(
      apiMapCampaignGroupDto.id,
      apiMapCampaignGroupDto.campaignIds,
    )
  }
}
