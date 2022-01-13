import { Injectable, Logger } from '@nestjs/common'
import { CampaignUserService } from '@app/campaign-user'
import { CampaignService } from '@app/campaign'
import campaignConfig from '../c01.config'
import { currentUnixTime } from '@app/common/utils'
import BaseCampaignService from '@app/common/campaign-service.abtract'
import { CampaignUserEntity } from '@app/campaign-user/entities/campaign-user.entity'
import { KafkaMessage } from '@app/kafka'
import { CampaignUserLogEntity } from '@app/campaign-user-log/entities/campaign-user-log.entity'
import { Campaign } from '@app/campaign/entities/campaign.entity'
@Injectable()
export class C01MainService implements BaseCampaignService {
  private readonly logger = new Logger(C01MainService.name)

  constructor(
    private readonly campaignUserService: CampaignUserService,
    private readonly campaignService: CampaignService,
  ) {}

  async upsertCampaignUser(
    eventName: string,
    message: KafkaMessage,
  ): Promise<CampaignUserEntity> {
    // Switch event
    let campaignUser = null
    switch (eventName) {
      case 'hl_user_spend_money':
        campaignUser = await this.userSpendMoney(campaignConfig.id, message)
        break
      default:
        break
    }

    return campaignUser
  }

  async isConquerReward(campaign: Campaign, campaignUser: CampaignUserEntity) {
    if (campaignUser.data['total_hl_money'] >= 50) {
      return true
    }
    return false
  }

  async isUserCanJoinCampaign(
    campaign: Campaign,
    userId: number,
  ): Promise<boolean> {
    // Get campaign user
    const campaignUser = await this.campaignUserService.getCampaignUser(
      campaign.id,
      userId,
    )
    if (!campaignUser) {
      return true
    }

    //
    if (campaignUser.isBanned) {
      return false
    }

    // Reach reward count or money limit
    if (
      campaignUser.successCount >= campaign.limitUserReward ||
      campaignUser.successCount >= campaign.limitSystemReward ||
      campaignUser.moneyEarned >= campaign.limitUserMoney ||
      campaignUser.moneyEarned >= campaign.limitSystemMoney
    ) {
      return false
    }

    // Check if user has referer

    return true
  }

  async isActiveCampaign(campaign: Campaign): Promise<boolean> {
    // Campaign is disabled
    if (!campaign.active) {
      return false
    }

    // Preparing data
    if (campaign.prepareDataRequired && !campaign.prepareDataDone) {
      return false
    }

    // Out of time range
    const nowUnixTime = currentUnixTime('second')
    if (campaign.startDate > nowUnixTime || campaign.endDate < nowUnixTime) {
      return false
    }

    // Reach limit of reward of money
    if (
      (campaign.limitSystemReward > 0 &&
        campaign.releasedReward >= campaign.limitSystemReward) ||
      (campaign.limitSystemMoney > 0 &&
        campaign.releasedMoney >= campaign.limitSystemMoney)
    ) {
      return false
    }

    return true
  }

  async userSpendMoney(
    campaignId: number,
    data: any,
  ): Promise<CampaignUserEntity> {
    let isNewUser = false
    let campaignUser = await this.campaignUserService.getCampaignUser(
      campaignId,
      data.value.user_id,
    )

    if (!campaignUser) {
      isNewUser = true
      campaignUser = new CampaignUserEntity()
      campaignUser.data = { total_hl_money: 0 } as any
    }

    const oldHlMoney = campaignUser.data['total_hl_money']
    campaignUser.data['total_hl_money'] = oldHlMoney + data.value.money

    const savedCampaignUser = await this.campaignUserService.save(campaignUser)

    // Write campaign user log
    // TODO: Broadcast event to save log
    const campaignUserLog = new CampaignUserLogEntity()
    campaignUserLog.note =
      'HL money (USDT) increased from ' +
      oldHlMoney.toLocaleString() +
      ' to ' +
      campaignUser.data['total_hl_money'].toLocaleString()

    return savedCampaignUser
  }

  async updateCampaignStats(campaignUser: CampaignUserEntity) {
    return await this.campaignService.updateCampaignStats(
      campaignUser.campaignId,
      campaignConfig.rewardMoney,
      1,
    )
  }

  async getCampaignById(campaignId) {
    return await this.campaignService.getCampaignById(campaignId)
  }
}
