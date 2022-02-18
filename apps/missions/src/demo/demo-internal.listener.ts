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
    const campaignId = 23
    const missionId = 47
    this.logger.log(
      `[STEP 2] from event get mission/campaign, campaign_id: ${campaignId}, mission_id: ${missionId}`,
    )

    const mission = await this.demoService.getMissionById(missionId)
    if (!mission) {
      this.logger.error('Mission not exist!!!')
      return
    }

    const grantTarget = JSON.parse(JSON.stringify(mission.grantTarget))

    grantTarget.map((target) => {
      const sendReward = {
        userId: +data.id,
        currency: target.currency,
        amount: target.amount,
        type: 'reward',
        campaignId: campaignId,
        missionId: missionId,
      }
      this.logger.log(
        `[STEP 3] using Event to send reward to BALANCE service, data: ${JSON.stringify(
          sendReward,
        )}`,
      )
      this.eventEmitter.emit('send_reward_to_balance', sendReward)
    })
  }
}
