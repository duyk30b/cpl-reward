import { Injectable } from '@nestjs/common'
import { CampaignService } from '@app/campaign'
import { ApiCreateCampaignDto } from './dto/api-create-campaign.dto'
import { plainToInstance } from 'class-transformer'
import { CreateRewardRuleDto } from '@app/reward-rule/dto/create-reward-rule.dto'
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

  async create(createCampaignDto: ApiCreateCampaignDto) {
    createCampaignDto.reward_rules.map(async (item) => {
      const createRewardRuleDto = plainToInstance(CreateRewardRuleDto, item, {
        ignoreDecorators: true,
      })
      createRewardRuleDto.campaignId = createCampaignDto.id
      createRewardRuleDto.missionId = null
      createRewardRuleDto.typeRule = 'campaign'

      const rewardRules = await this.rewardRuleService.find({
        campaignId: createRewardRuleDto.campaignId,
        typeRule: createRewardRuleDto.typeRule,
        key: createRewardRuleDto.key,
      })
      if (rewardRules.length < 1) {
        await this.rewardRuleService.create(createRewardRuleDto)
      }
    })
    return await this.campaignService.create(createCampaignDto)
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

    return campaign
  }

  async update(id: number, updateCampaignDto: ApiUpdateCampaignDto) {
    updateCampaignDto.reward_rules.map(async (item) => {
      const updateRewardRuleDto = plainToInstance(UpdateRewardRuleDto, item, {
        ignoreDecorators: true,
      })
      updateRewardRuleDto.campaignId = id
      updateRewardRuleDto.missionId = null
      updateRewardRuleDto.typeRule = 'campaign'
      await this.rewardRuleService.update(updateRewardRuleDto)
    })
    return await this.campaignService.update({
      id,
      ...updateCampaignDto,
    })
  }
}
