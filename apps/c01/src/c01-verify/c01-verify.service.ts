import { Injectable } from '@nestjs/common'
import { CampaignUserEntity } from '@app/campaign-user/entities/campaign-user.entity'
import { Campaign } from '@app/campaign/entities/campaign.entity'

@Injectable()
export class C01VerifyService {
  async verify(campaign: Campaign, campaignUser: CampaignUserEntity) {
    // eslint-disable-next-line no-console
    console.log(campaignUser)
    return true
  }
}
