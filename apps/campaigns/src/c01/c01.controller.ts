import { Controller, Logger } from '@nestjs/common'
import campaignConfig from './c01.config'
import { C01MainService } from './services/c01-main.service'
import { C01GiveService } from './services/c01-give.service'
import { C01VerifyService } from './services/c01-verify.service'

@Controller()
export class C01Controller {
  private readonly logger = new Logger(C01Controller.name)
  constructor(
    private readonly c01MainService: C01MainService,
    private readonly c01GiveService: C01GiveService,
    private readonly c01VerifyService: C01VerifyService,
  ) {}

  async main(eventName: string, message: any) {
    // Step 1: Insert user to campaign
    const campaign = await this.c01MainService.getCampaignById(
      campaignConfig.id,
    )
    if (!campaign) {
      this.logger.debug(campaignConfig.id + ' not found')
      return
    }

    const campaignUser = await this.c01MainService.upsertCampaignUser(
      eventName,
      message,
    )
    if (!campaignUser) {
      return
    }

    if (!(await this.c01MainService.isActiveCampaign(campaign))) {
      return
    }

    // Step 2: Check if user conquer the reward
    const conquerReward = await this.c01MainService.isConquerReward(
      campaign,
      campaignUser,
    )
    if (!conquerReward) {
      return
    }

    // Step 3: Call official external service to confirm
    const verifyConquerReward = await this.c01VerifyService.verify(
      campaign,
      campaignUser,
    )
    if (!verifyConquerReward) {
      return
    }

    // Step 4: Call external service to give reward
    const giveRewardSuccess = await this.c01GiveService.give(
      campaign,
      campaignUser,
    )
    if (!giveRewardSuccess) {
      return
    }

    // Step 5: Update campaign stats
    this.c01MainService.updateCampaignStats(campaignUser).then()
  }
}
