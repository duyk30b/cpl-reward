import { Injectable, Logger } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { DemoService } from './demo.service'

@Injectable()
export class DemoInternalListener {
  private readonly logger = new Logger(DemoInternalListener.name)

  constructor(
    private eventEmitter: EventEmitter2,
    private readonly demoService: DemoService,
  ) {}

  @OnEvent('auth_user_login')
  async handleAuthUserLoginEvent(data: { id: string }) {
    // Step 1: from event get mission/campaign
    const campaignId = 17
    const missionId = 45

    // Step 2: get mission
    const mission = await this.demoService.getMissionById(missionId)
    if (!mission) this.logger.warn('Mission not exist!!!')

    // Step 3: get campaign
    const campaign = await this.demoService.getCampaignById(campaignId)
    if (!campaign) this.logger.warn('Campaign not exist!!!')

    const grantTarget = JSON.parse(JSON.stringify(mission.grantTarget))

    // Step 4: call to balance to send reward
    grantTarget.map((target) => {
      const sendReward = {
        currency: target.currency.toLowerCase(),
        amount: target.amount,
        type: 'reward',
        campaignId: campaign.id,
        missionId: mission.id,
      }
      this.eventEmitter.emit('send_reward_to_balance', sendReward)
    })
  }
}
