import { CampaignUserEntity } from '@app/campaign-user/entities/campaign-user.entity'
import { CampaignEntity } from '@app/campaign/entities/campaign.entity'

export default interface BaseCampaignService {
  isActiveCampaign(campaign: CampaignEntity): Promise<boolean>

  isUserCanJoinCampaign(
    campaign: CampaignEntity,
    userId: number,
  ): Promise<boolean>

  isConquerReward(
    campaign: CampaignEntity,
    campaignUser: CampaignUserEntity,
  ): Promise<boolean>
}
