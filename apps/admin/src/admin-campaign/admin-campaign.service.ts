import { Injectable } from '@nestjs/common'
import { CampaignService } from '@lib/campaign'
import { plainToInstance } from 'class-transformer'
import { UpdateRewardRuleDto } from '@lib/reward-rule/dto/update-reward-rule.dto'
import { RewardRuleService } from '@lib/reward-rule'
import { ApiUpdateCampaignDto } from './dto/api-update-campaign.dto'
import { UpdateCampaignDto } from '@lib/campaign/dto/update-campaign.dto'
import { ApiCreateCampaignDto } from './dto/api-create-campaign.dto'
import { CreateCampaignDto } from '@lib/campaign/dto/create-campaign.dto'
import { CreateRewardRuleDto } from '@lib/reward-rule/dto/create-reward-rule.dto'
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder'
import { Campaign } from '@lib/campaign/entities/campaign.entity'

@Injectable()
export class AdminCampaignService {
  constructor(
    private readonly campaignService: CampaignService,
    private readonly rewardRuleService: RewardRuleService,
  ) {}

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

  async create(createCampaignDto: ApiCreateCampaignDto) {
    const rewardRules = createCampaignDto.rewardRules
    const createCampaign = plainToInstance(
      CreateCampaignDto,
      createCampaignDto,
      {
        ignoreDecorators: true,
        excludeExtraneousValues: true,
      },
    )
    let campaign = await this.campaignService.create(createCampaign)
    await Promise.all(
      rewardRules.map(async (item) => {
        const createRewardRuleDto = plainToInstance(CreateRewardRuleDto, item, {
          ignoreDecorators: true,
        })
        createRewardRuleDto.campaignId = campaign.id
        createRewardRuleDto.typeRule = 'campaign'
        await this.rewardRuleService.create(createRewardRuleDto)
        return item
      }),
    )
    campaign = await this.campaignService.getById(campaign.id, {
      relations: ['rewardRules'],
    })
    campaign.rewardRules = campaign.rewardRules.filter(
      (item) => item.typeRule == 'campaign',
    )
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

  async findAll(page: number, limit: number) {
    limit = limit > 100 ? 100 : limit
    const options = { page, limit }
    const queryBuilder = this.queryBuilder()
    return this.campaignService.camelPaginate(options, queryBuilder)
  }

  private queryBuilder(): SelectQueryBuilder<Campaign> {
    const queryBuilder = this.campaignService.initQueryBuilder()
    return queryBuilder
      .select('campaign.title')
      .orderBy('campaign.priority', 'DESC')
      .addOrderBy('campaign.id', 'DESC')
  }
}
