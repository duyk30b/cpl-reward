import { Injectable } from '@nestjs/common'
import { ApiCreateCampaignDto } from './dto/api-create-campaign.dto'
import { ApiUpdateCampaignDto } from './dto/api-update-campaign.dto'
import { CampaignService } from '@app/campaign'
import { MissionService } from '@app/mission'
// TODO: remove below import
// import { ApiMapCampaignGroupDto } from './dto/api-map-campaign.dto'
// import { CampaignGroupMapService } from '@app/campaign-map'

@Injectable()
export class ApiCampaignService {
  constructor(
    private readonly campaignService: CampaignService,
    private readonly missionService: MissionService, // private readonly campaignGroupMapService: CampaignGroupMapService,
  ) {}

  async create(apiCreateCampaignGroupDto: ApiCreateCampaignDto) {
    return await this.campaignService.create(apiCreateCampaignGroupDto)
  }

  async findOne(id: number) {
    const campaignGroup = await this.campaignService.getById(id)
    if (!campaignGroup) {
      return null
    }

    // TODO: remove below import
    // const mapCampaigns = await this.campaignGroupMapService.getMapsByGroupId(
    //   campaignGroup.id,
    // )
    // const campaignIds = mapCampaigns.map((m) => {
    //   return m.campaignId
    // })
    //
    // campaignGroup['campaigns'] = await this.campaignService.getByIds(
    //   campaignIds,
    // )

    return campaignGroup
  }

  async update(id: number, apiUpdateCampaignGroupDto: ApiUpdateCampaignDto) {
    return await this.campaignService.update({
      id,
      ...apiUpdateCampaignGroupDto,
    })
  }

  async findAll(page: number, limit: number) {
    limit = limit > 100 ? 100 : limit
    return this.campaignService.paginate({
      page,
      limit,
    })
  }

  // TODO: remove below import
  // async mapCampaigns(apiMapCampaignGroupDto: ApiMapCampaignGroupDto) {
  //   return await this.campaignGroupMapService.mapCampaigns(
  //     apiMapCampaignGroupDto.id,
  //     apiMapCampaignGroupDto.campaignIds,
  //   )
  // }
  // async unmapCampaigns(apiMapCampaignGroupDto) {
  //   return await this.campaignGroupMapService.unmapCampaigns(
  //     apiMapCampaignGroupDto.id,
  //     apiMapCampaignGroupDto.campaignIds,
  //   )
  // }
}
