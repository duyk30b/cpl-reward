import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { CampaignService } from '@lib/campaign'
import {
  EVENTS,
  GRANT_TARGET_USER,
  GRANT_TARGET_WALLET,
  MissionService,
} from '@lib/mission'
import { UserRewardHistoryService } from '@lib/user-reward-history'
import { CommonService } from '@lib/common'

@Injectable()
export class ApiMissionListener {
  constructor(
    private readonly campaignService: CampaignService,
    private readonly missionService: MissionService,
    private readonly userRewardHistoryService: UserRewardHistoryService,
  ) {}

  @OnEvent('phake_data')
  async handleFakeData() {
    let campaignId = null
    for (let i = 1; i <= 10; i++) {
      const campaign = await this.campaignService.create({
        title: `Title Campaign ${i}`,
        titleJp: `Title Campaign ${i}`,
        description: `Description Campaign ${i}`,
        descriptionJp: `Description Campaign ${i}`,
        startDate: 1647855382,
        endDate: 1647855381,
        notificationLink: `notificationLink Campaign ${i}`,
        notificationLinkJp: `notificationLink Campaign ${i}`,
        campaignImage: `campaignImage Campaign ${i}`,
        campaignImageJp: `campaignImage Campaign ${i}`,
      })
      if (campaignId === null) campaignId = campaign.id
    }
    for (let j = 1; j <= 100; j++) {
      const mission = await this.missionService.create({
        campaignId,
        title: `Title Mission ${j}`,
        titleJp: `Title Mission ${j}`,
        detailExplain: `detailExplain Mission ${j}`,
        detailExplainJp: `detailExplain Mission ${j}`,
        openingDate: 1647855382,
        closingDate: 1647855381,
        guideLink: `guideLink Mission ${j}`,
        guideLinkJp: `guideLink Mission ${j}`,
        judgmentConditions: [
          {
            eventName: EVENTS.AUTH_USER_LOGIN,
            property: 'ip',
            operator: '==',
            value: '192.168.0.1',
          },
        ],
        userConditions: [
          {
            property: 'ip',
            operator: '==',
            value: '192.168.0.1',
          },
        ],
        grantTarget: [
          {
            user: GRANT_TARGET_USER.USER,
            amount: 1000,
            currency: 'USDT',
            wallet: GRANT_TARGET_WALLET.REWARD_BALANCE,
            type: 'balance',
          },
        ],
      })

      for (let k = 1; k <= 10; k++) {
        await this.userRewardHistoryService.save({
          campaignId,
          missionId: mission.id,
          userId: CommonService.randomItem([55093, 55094]),
          userType: CommonService.randomItem([
            GRANT_TARGET_USER.USER,
            GRANT_TARGET_USER.REFERRAL_USER,
          ]),
          amount: CommonService.randomItem([10, 15, 20]),
          currency: 'USDT',
          wallet: CommonService.randomItem([
            GRANT_TARGET_WALLET.REWARD_BALANCE,
            GRANT_TARGET_WALLET.DIRECT_BALANCE,
            GRANT_TARGET_WALLET.REWARD_CASHBACK,
            GRANT_TARGET_WALLET.DIRECT_CASHBACK,
          ]),
        })
      }
    }
  }
}
