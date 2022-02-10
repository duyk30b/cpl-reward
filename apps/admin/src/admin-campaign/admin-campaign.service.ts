import { Injectable } from '@nestjs/common'
import { CampaignService } from '@app/campaign'
import { plainToInstance } from 'class-transformer'
import { UpdateRewardRuleDto } from '@app/reward-rule/dto/update-reward-rule.dto'
import { RewardRuleService } from '@app/reward-rule'
import { ApiUpdateCampaignDto } from './dto/api-update-campaign.dto'
import { UpdateCampaignDto } from '@app/campaign/dto/update-campaign.dto'

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

  async findOne(id: number) {
    const campaign = await this.campaignService.getById(id, {
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

  async update(updateCampaignDto: ApiUpdateCampaignDto) {
    const rewardRules = updateCampaignDto.rewardRules
    const updateCampaign = plainToInstance(
      UpdateCampaignDto,
      updateCampaignDto,
      {
        ignoreDecorators: true,
        excludeExtraneousValues: true,
      },
    )
    await this.campaignService.update(updateCampaign)
    await Promise.all(
      rewardRules.map(async (item) => {
        const updateRewardRuleDto = plainToInstance(UpdateRewardRuleDto, item, {
          ignoreDecorators: true,
        })
        updateRewardRuleDto.campaignId = updateCampaignDto.id
        updateRewardRuleDto.typeRule = 'campaign'
        await this.rewardRuleService.update(updateRewardRuleDto)
        return item
      }),
    )
    const campaign = await this.campaignService.getById(updateCampaign.id, {
      relations: ['rewardRules'],
    })
    campaign.rewardRules = campaign.rewardRules.filter(
      (item) => item.typeRule == 'campaign',
    )
    return campaign
  }
}
