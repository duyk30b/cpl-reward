import { Injectable } from '@nestjs/common'
import { MissionService } from '@app/mission'
import { ApiCreateMissionDto } from './dto/api-create-mission.dto'
import { plainToInstance } from 'class-transformer'
import { CreateRewardRuleDto } from '@app/reward-rule/dto/create-reward-rule.dto'
import { RewardRuleService } from '@app/reward-rule'
import { UpdateRewardRuleDto } from '@app/reward-rule/dto/update-reward-rule.dto'
import { ApiUpdateMissionDto } from './dto/api-update-mission.dto'

@Injectable()
export class AdminMissionService {
  constructor(
    private readonly missionService: MissionService,
    private readonly rewardRuleService: RewardRuleService,
  ) {}

  async create(createMissionDto: ApiCreateMissionDto) {
    const mission = await this.missionService.create(createMissionDto)
    createMissionDto.reward_rules.map(async (item) => {
      const createRewardRuleDto = plainToInstance(CreateRewardRuleDto, item, {
        ignoreDecorators: true,
      })
      createRewardRuleDto.campaignId = createMissionDto.campaignId
      createRewardRuleDto.missionId = mission.id
      createRewardRuleDto.typeRule = 'mission'

      const rewardRules = await this.rewardRuleService.find({
        campaignId: createRewardRuleDto.campaignId,
        missionId: createRewardRuleDto.missionId,
        typeRule: createRewardRuleDto.typeRule,
        key: createRewardRuleDto.key,
      })
      if (rewardRules.length < 1) {
        await this.rewardRuleService.create(createRewardRuleDto)
      }
    })
    return mission
  }

  async update(id: number, updateMissionDto: ApiUpdateMissionDto) {
    const mission = await this.missionService.update({
      id,
      ...updateMissionDto,
    })
    updateMissionDto.reward_rules.map(async (item) => {
      const updateRewardRuleDto = plainToInstance(UpdateRewardRuleDto, item, {
        ignoreDecorators: true,
      })
      updateRewardRuleDto.campaignId = mission.campaignId
      updateRewardRuleDto.missionId = id
      updateRewardRuleDto.typeRule = 'mission'
      await this.rewardRuleService.update(updateRewardRuleDto)
    })
    return mission
  }

  async findAll(page: number, limit: number) {
    limit = limit > 100 ? 100 : limit
    return this.missionService.paginate({
      page,
      limit,
    })
  }

  async findOne(id: number) {
    const mission = await this.missionService.getById(id, {
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
