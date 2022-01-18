import { Injectable, Logger } from '@nestjs/common'
import { CampaignUserService } from '@app/campaign-user'
import { CampaignService } from '@app/campaign'
import campaignConfig from './c01.config'
import { currentUnixTime } from '@app/common/utils'
import BaseCampaignService from '@app/common/campaign-service.abtract'
import { CampaignUser } from '@app/campaign-user/entities/campaign-user.entity'
import { Campaign } from '@app/campaign/entities/campaign.entity'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { HlUserSpendMoney } from '@app/common/interfaces/hl-user-spend-money'
import { EventCampaignUserLog } from '@app/common/interfaces/event-campaign-user-log'
@Injectable()
export class C01Service implements BaseCampaignService {
  private readonly logger = new Logger(C01Service.name)

  constructor(
    private readonly campaignUserService: CampaignUserService,
    private readonly campaignService: CampaignService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async main(eventName: string, message: any) {
    // Step 1: Insert user to campaign
    const campaign = await this.getById(campaignConfig.id)
    if (!campaign) {
      this.logger.debug(campaignConfig.id + ' not found')
      return
    }

    const campaignUser = await this.upsertCampaignUser(eventName, message)
    if (!campaignUser) {
      return
    }

    if (!(await this.isActiveCampaign(campaign))) {
      return
    }

    // Step 2: Check if user conquer the reward
    const conquerReward = await this.isConquerReward(campaign, campaignUser)
    if (!conquerReward) {
      return
    }

    // Step 3: Call official external service to confirm
    const verifyConquerReward = await this.verify(campaign, campaignUser)
    if (!verifyConquerReward) {
      return
    }

    // Step 4: Call external service to give reward
    const giveRewardSuccess = await this.give(campaign, campaignUser)
    if (!giveRewardSuccess) {
      return
    }

    // Step 5: Update campaign stats
    this.updateStats(campaignUser).then()
  }

  async upsertCampaignUser(
    eventName: string,
    data: any,
  ): Promise<CampaignUser> {
    // Switch event
    let campaignUser = null
    switch (eventName) {
      case 'hl_user_spend_money':
        campaignUser = await this.userSpendMoney(campaignConfig.id, data)
        break
      default:
        break
    }

    return campaignUser
  }

  async isConquerReward(campaign: Campaign, campaignUser: CampaignUser) {
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
    data: HlUserSpendMoney,
  ): Promise<CampaignUser> {
    const logEventName = campaignConfig.eventLogPrefix + 'userSpendMoney'
    let isNewUser = false
    let campaignUser = await this.campaignUserService.getCampaignUser(
      campaignId,
      data.userId,
    )

    if (!campaignUser) {
      isNewUser = true
      campaignUser = new CampaignUser()
      campaignUser.data = { total_hl_money: 0 } as any
    }

    const oldHlMoney = campaignUser.data['total_hl_money']
    campaignUser.data['total_hl_money'] = oldHlMoney + data.amount

    const savedCampaignUser = await this.campaignUserService.save(campaignUser)

    // Write campaign user log
    const eventCampaignUserLog = new EventCampaignUserLog()
    eventCampaignUserLog.name = logEventName
    eventCampaignUserLog.isNewUser = isNewUser
    eventCampaignUserLog.campaignUser = savedCampaignUser
    eventCampaignUserLog.extraData = { hlUserSpendMoney: data }
    this.eventEmitter.emit(logEventName, eventCampaignUserLog)

    return savedCampaignUser
  }

  async updateStats(campaignUser: CampaignUser) {
    return await this.campaignService.updateStats(
      campaignUser.campaignId,
      campaignConfig.rewardMoney,
      1,
    )
  }

  async getById(campaignId) {
    return await this.campaignService.getById(campaignId)
  }

  async verify(campaign: Campaign, campaignUser: CampaignUser) {
    // eslint-disable-next-line no-console
    console.log(campaignUser)
    return true
  }

  async give(campaign: Campaign, campaignUser: CampaignUser) {
    return true
  }
}
