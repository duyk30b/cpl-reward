import { Injectable } from '@nestjs/common'
import { ApiCreateCampaignGroupDto } from './dto/api-create-campaign-group.dto'
import { ApiUpdateCampaignGroupDto } from './dto/api-update-campaign-group.dto'
import { CampaignGroupService } from '@app/campaign-group'
import { ApiMapCampaignGroupDto } from './dto/api-map-campaign-group.dto'
import { CampaignService } from '@app/campaign'
import { CampaignGroupMapService } from '@app/campaign-group-map'

@Injectable()
export class ApiCampaignGroupService {
  constructor(
    private readonly campaignGroupService: CampaignGroupService,
    private readonly campaignService: CampaignService,
    private readonly campaignGroupMapService: CampaignGroupMapService,
  ) {}

  async create(apiCreateCampaignGroupDto: ApiCreateCampaignGroupDto) {
    return await this.campaignGroupService.create(apiCreateCampaignGroupDto)
  }

  async findOne(id: number) {
    const campaignGroup = await this.campaignGroupService.getById(id)
    if (!campaignGroup) {
      return null
    }

    const mapCampaigns = await this.campaignGroupMapService.getMapsByGroupId(
      campaignGroup.id,
    )

    const campaignIds = mapCampaigns.map((m) => {
      return m.campaignId
    })

    campaignGroup['campaigns'] = await this.campaignService.getByIds(
      campaignIds,
    )

    return campaignGroup
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
    return await this.campaignGroupMapService.mapCampaigns(
      apiMapCampaignGroupDto.id,
      apiMapCampaignGroupDto.campaignIds,
    )
  }

  async unmapCampaigns(apiMapCampaignGroupDto) {
    return await this.campaignGroupMapService.unmapCampaigns(
      apiMapCampaignGroupDto.id,
      apiMapCampaignGroupDto.campaignIds,
    )
  }
}
