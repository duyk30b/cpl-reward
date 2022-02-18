import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { DemoService } from './demo.service'
import { SendRewardToBalanceInput } from './demo.interface'

@Injectable()
export class DemoLocalListener {
  private readonly logger = new Logger(DemoLocalListener.name)

  constructor(private readonly demoService: DemoService) {}

  @OnEvent('send_reward_to_balance')
  async handleSendRewardToBalanceEvent(data: SendRewardToBalanceInput) {
    const mission = await this.demoService.getMissionById(data.missionId)
    const campaign = await this.demoService.getCampaignById(data.campaignId)
  }
}
