import { Injectable } from '@nestjs/common'
import { CampaignUserLog } from '@app/campaign-user-log/entities/campaign-user-log.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class CampaignUserLogService {
  constructor(
    @InjectRepository(CampaignUserLog)
    private campaignUserLogRepository: Repository<CampaignUserLog>,
  ) {}
  async save(campaignUserLog: CampaignUserLog) {
    return await this.campaignUserLogRepository.save(campaignUserLog)
  }
}
