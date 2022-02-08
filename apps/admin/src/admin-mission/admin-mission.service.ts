import { Injectable } from '@nestjs/common'
import { MissionService } from '@app/mission'
import { ApiCreateMissionDto } from './dto/api-create-mission.dto'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { CreateRewardRuleDto } from '@app/reward-rule/dto/create-reward-rule.dto'
import { RewardRuleService } from '@app/reward-rule'
import { UpdateRewardRuleDto } from '@app/reward-rule/dto/update-reward-rule.dto'
import { ApiUpdateMissionDto } from './dto/api-update-mission.dto'
import { CreateMissionDto } from '@app/mission/dto/create-mission.dto'
import { UpdateMissionDto } from '@app/mission/dto/update-mission.dto'

@Injectable()
export class AdminMissionService {
  constructor(
    private readonly missionService: MissionService,
    private readonly rewardRuleService: RewardRuleService,
  ) {}

  private static convertObjectToString(
    missionDto: ApiCreateMissionDto | ApiUpdateMissionDto,
  ) {
    const missionPlain = instanceToPlain(missionDto)
    missionPlain.judgment_conditions = JSON.stringify(
      missionPlain.judgment_conditions,
    )
    missionPlain.user_conditions = JSON.stringify(missionPlain.user_conditions)
    missionPlain.grant_target = JSON.stringify(missionPlain.grant_target)
    return missionPlain
  }

  async create(createMissionDto: ApiCreateMissionDto) {
    const createMissionPlain = AdminMissionService.convertObjectToString(
      createMissionDto,
    ) as CreateMissionDto
    const mission = await this.missionService.create(createMissionPlain)
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
    const updateMissionPlain = AdminMissionService.convertObjectToString(
      updateMissionDto,
    ) as UpdateMissionDto

    const mission = await this.missionService.update({
      id,
      ...updateMissionPlain,
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
