import { Controller } from '@nestjs/common'
import { AdminCampaignService } from './admin-campaign.service'
import { GrpcMethod } from '@nestjs/microservices'
import {
  CancelInput,
  CreateInput,
  FindOneInput,
  UpdateInput,
} from './admin-campaign.interface'
import { Campaign } from '@app/campaign/entities/campaign.entity'

@Controller('campaign')
export class AdminCampaignController {
  constructor(private readonly adminCampaignService: AdminCampaignService) {}

  @GrpcMethod('GrpcAdminCampaignService', 'Create')
  async create(data: CreateInput): Promise<Campaign> {
    return await this.adminCampaignService.create(data)
  }

  @GrpcMethod('GrpcAdminCampaignService', 'Cancel')
  async cancel(data: CancelInput): Promise<{ affected: number }> {
    return await this.adminCampaignService.cancel(+data.campaignId)
  }

  @GrpcMethod('GrpcAdminCampaignService', 'FindOne')
  async findOne(data: FindOneInput): Promise<Campaign> {
    return await this.adminCampaignService.findOne(+data.id)
  }

  @GrpcMethod('GrpcAdminCampaignService', 'Update')
  async update(data: UpdateInput): Promise<any> {
    return await this.adminCampaignService.update(data)
  }
}
