import { Injectable } from '@nestjs/common'
import { CampaignUserEntity } from '@app/campaign-user/entities/campaign-user.entity'
import { Campaign } from '@app/campaign/entities/campaign.entity'

@Injectable()
export class C01GiveService {
  async give(campaign: Campaign, campaignUser: CampaignUserEntity) {
    return true
  }
}
