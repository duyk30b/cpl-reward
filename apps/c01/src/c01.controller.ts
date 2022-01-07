import { Controller, Logger } from '@nestjs/common'
import { C01Service } from './c01.service'
import { KafkaMessage, KafkaTopic } from '@app/kafka'
import { Payload } from '@nestjs/microservices'
import { C01GiveService } from './c01-give/c01-give.service'
import { C01VerifyService } from './c01-verify/c01-verify.service'
import { plainToInstance } from 'class-transformer'
import { HlUserSpendMoneyDto } from '@app/kafka/dto/hl-user-spend-money.dto'
import { validate } from 'class-validator'
import campaignConfig from './c01.config'

@Controller()
export class C01Controller {
  private readonly logger = new Logger(C01Controller.name)
  constructor(
    private readonly c01Service: C01Service,
    private readonly c01GiveService: C01GiveService,
    private readonly c01VerifyService: C01VerifyService,
  ) {}

  @KafkaTopic('kafka.hl_user_spend_money')
  async createOrder(@Payload() message: KafkaMessage): Promise<void> {
    // Transform message
    message.value = plainToInstance(HlUserSpendMoneyDto, message.value, {
      enableImplicitConversion: true,
    })
    if (!(await validate(message.value))) {
      this.logger.warn(
        'Wrong hl_user_spend_money message struct: ' +
          JSON.stringify(message.value),
      )
      return
    }

    // Main function
    this.main('hl_user_spend_money', message).then()
  }

  async main(eventName: string, message: any) {
    // Step 1: Insert user to campaign
    const campaign = await this.c01Service.getCampaignById(campaignConfig.id)
    if (!campaign) {
      this.logger.debug(campaignConfig.id + ' not found')
      return
    }

    const campaignUser = await this.c01Service.upsertCampaignUser(
      eventName,
      message,
    )
    if (!campaignUser) {
      return
    }

    if (!(await this.c01Service.isActiveCampaign(campaign))) {
      return
    }

    // Step 2: Check if user conquer the reward
    const conquerReward = await this.c01Service.isConquerReward(
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
    this.c01Service.updateCampaignStats(campaignUser).then()
  }
}
