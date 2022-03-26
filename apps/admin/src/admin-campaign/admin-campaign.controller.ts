import { Controller } from '@nestjs/common'
import { AdminCampaignService } from './admin-campaign.service'
import { GrpcMethod } from '@nestjs/microservices'
import {
  CancelInput,
  CreateCampaignInput,
  FindOneInput,
  ICampaignFilter,
  UpdateCampaignInput,
} from './admin-campaign.interface'

@Controller('campaign')
export class AdminCampaignController {
  constructor(private readonly adminCampaignService: AdminCampaignService) {}

  @GrpcMethod('GrpcAdminCampaignService', 'Create')
  async create(data: CreateCampaignInput) {
    return await this.adminCampaignService.create(data)
  }

  @GrpcMethod('GrpcAdminCampaignService', 'Cancel')
  async cancel(data: CancelInput) {
    return await this.adminCampaignService.cancel(+data.campaignId)
  }

  @GrpcMethod('GrpcAdminCampaignService', 'FindOne')
  async findOne(data: FindOneInput) {
    const result = await this.adminCampaignService.findOne(+data.id)
    if (result !== undefined) return result
    return {}
  }

  @GrpcMethod('GrpcAdminCampaignService', 'Update')
  async update(data: UpdateCampaignInput) {
    return await this.adminCampaignService.update(data)
  }

  @GrpcMethod('GrpcAdminCampaignService', 'List')
  async list(campaignFilter: ICampaignFilter) {
    return await this.adminCampaignService.findAll(campaignFilter)
  }
}
