import { Injectable } from '@nestjs/common'
import { CampaignEntity } from '@app/campaign/entities/campaign.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(CampaignEntity)
    private campaignRepository: Repository<CampaignEntity>,
  ) {}

  async getCampaignById(campaignId: number) {
    return await this.campaignRepository.findOne(campaignId)
  }

  async save(campaign: CampaignEntity) {
    return await this.campaignRepository.save(campaign)
  }
}
