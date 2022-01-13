import { CampaignUser } from '@app/campaign-user/entities/campaign-user.entity'
import { Campaign } from '@app/campaign/entities/campaign.entity'

export default interface BaseCampaignService {
  isActiveCampaign(campaign: Campaign): Promise<boolean>

  isUserCanJoinCampaign(campaign: Campaign, userId: number): Promise<boolean>

  isConquerReward(
    campaign: Campaign,
    campaignUser: CampaignUser,
  ): Promise<boolean>
}
