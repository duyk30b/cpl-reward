import { Injectable, Logger } from '@nestjs/common'
import { Campaign } from '@lib/campaign/entities/campaign.entity'
import { CampaignService } from '@lib/campaign'
import { MissionService } from '@lib/mission'

@Injectable()
export class DemoService {
  private readonly logger = new Logger(DemoService.name)

  constructor(
    private readonly campaignService: CampaignService,
    private readonly missionService: MissionService,
  ) {}

  async getCampaignById(campaignId: number): Promise<Campaign> {
    const campaign = await this.campaignService.getById(campaignId, {
      relations: ['rewardRules'],
    })
    if (!campaign) {
      return null
    }
    if (campaign.rewardRules !== undefined && campaign.rewardRules.length > 0) {
      campaign.rewardRules = campaign.rewardRules.filter(
        (item) => item.typeRule == 'campaign',
      )
    }
    return campaign
  }

  async getMissionById(missionId: number) {
    const mission = await this.missionService.getById(missionId, {
      relations: ['rewardRules'],
    })
    if (!mission) {
      return null
    }
    mission.rewardRules = mission.rewardRules.filter(
      (item) => item.typeRule == 'mission',
    )

    return mission
  }
}
