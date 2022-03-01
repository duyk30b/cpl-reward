import { Controller } from '@nestjs/common'
import { AdminCampaignService } from './admin-campaign.service'
import { GrpcMethod } from '@nestjs/microservices'
import { CancelInput, FindOneInput } from './admin-campaign.interface'
import { ApiCreateCampaignDto } from './dto/api-create-campaign.dto'
import { ApiUpdateCampaignDto } from './dto/api-update-campaign.dto'
import { ApiListCampaignDto } from './dto/api-list-campaign.dto'

@Controller('campaign')
export class AdminCampaignController {
  constructor(private readonly adminCampaignService: AdminCampaignService) {}

  @GrpcMethod('GrpcAdminCampaignService', 'Create')
  async create(data: ApiCreateCampaignDto) {
    return await this.adminCampaignService.create(data)
  }

  @GrpcMethod('GrpcAdminCampaignService', 'Cancel')
  async cancel(data: CancelInput) {
    return await this.adminCampaignService.cancel(+data.campaignId)
  }

  @GrpcMethod('GrpcAdminCampaignService', 'FindOne')
  async findOne(data: FindOneInput) {
    return await this.adminCampaignService.findOne(+data.id)
  }

  @GrpcMethod('GrpcAdminCampaignService', 'Update')
  async update(data: ApiUpdateCampaignDto) {
    return await this.adminCampaignService.update(data)
  }

  @GrpcMethod('GrpcAdminCampaignService', 'List')
  async list(data: ApiListCampaignDto) {
    return await this.adminCampaignService.findAll(
      data.page || 1,
      data.limit || 10,
    )
  }
}
