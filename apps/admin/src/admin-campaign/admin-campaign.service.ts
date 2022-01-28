import { Injectable } from '@nestjs/common'
import { CampaignService } from '@app/campaign'
import { plainToInstance } from 'class-transformer'
import { UpdateRewardRuleDto } from '@app/reward-rule/dto/update-reward-rule.dto'
import { RewardRuleService } from '@app/reward-rule'
import { ApiUpdateCampaignDto } from './dto/api-update-campaign.dto'

@Injectable()
export class AdminCampaignService {
  constructor(
    private readonly campaignService: CampaignService,
    private readonly rewardRuleService: RewardRuleService,
  ) {}

  async init(): Promise<{ id: number }> {
    const campaign = await this.campaignService.init()
    return { id: campaign.id }
  }

  async cancel(id: number): Promise<{ affected: number }> {
    const deleteResult = await this.campaignService.delete(id)
    return {
      affected: deleteResult.affected,
    }
  }

  async findAll(page: number, limit: number) {
    limit = limit > 100 ? 100 : limit
    return this.campaignService.paginate({
      page,
      limit,
    })
  }

  async findOne(id: number) {
    const campaign = await this.campaignService.getById(id)
    if (!campaign) {
      return null
    }
    if (campaign.rewardRules.length > 0) {
      campaign.rewardRules = campaign.rewardRules.filter(
        (item) => item.typeRule == 'campaign',
      )
    }
    return campaign
  }

  async update(id: number, updateCampaignDto: ApiUpdateCampaignDto) {
    updateCampaignDto.reward_rules.map(async (item) => {
      const updateRewardRuleDto = plainToInstance(UpdateRewardRuleDto, item, {
        ignoreDecorators: true,
      })
      const rewardRules = await this.rewardRuleService.find({
        campaignId: id,
        typeRule: 'campaign',
        key: updateRewardRuleDto.key,
      })
      if (rewardRules.length < 1) {
        updateRewardRuleDto.campaignId = id
        updateRewardRuleDto.typeRule = 'campaign'
        await this.rewardRuleService.update(updateRewardRuleDto)
      }
      return item
    })
    return await this.campaignService.update({
      id,
      ...updateCampaignDto,
    })
  }
}
