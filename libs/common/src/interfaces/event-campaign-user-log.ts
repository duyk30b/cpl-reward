import { CampaignUser } from '@app/campaign-user/entities/campaign-user.entity'

export class EventCampaignUserLog {
  name: string
  isNewUser = false
  isGiveRewardSuccess = false
  campaignUser: CampaignUser
  extraData: any
}
