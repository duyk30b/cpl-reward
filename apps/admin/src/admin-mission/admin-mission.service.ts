import { Injectable } from '@nestjs/common'
import { MissionService } from '@app/mission'
import { ApiCreateMissionDto } from './dto/api-create-mission.dto'
import { plainToInstance } from 'class-transformer'
import { CreateRewardRuleDto } from '@app/reward-rule/dto/create-reward-rule.dto'
import { RewardRuleService } from '@app/reward-rule'
import { UpdateRewardRuleDto } from '@app/reward-rule/dto/update-reward-rule.dto'
import { ApiUpdateMissionDto } from './dto/api-update-mission.dto'
import { CreateMissionDto } from '@app/mission/dto/create-mission.dto'
import { UpdateMissionDto } from '@app/mission/dto/update-mission.dto'
import { Mission } from '@app/mission/entities/mission.entity'

@Injectable()
export class AdminMissionService {
  constructor(
    private readonly missionService: MissionService,
    private readonly rewardRuleService: RewardRuleService,
  ) {}

  async create(createMissionDto: ApiCreateMissionDto) {
    const createMission = plainToInstance(CreateMissionDto, createMissionDto, {
      ignoreDecorators: true,
    })
    let mission = await this.missionService.create(createMission)

    await Promise.all(
      createMissionDto.rewardRules.map(async (item) => {
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
      }),
    )
    mission = await this.missionService.getById(mission.id, {
      relations: ['rewardRules'],
    })
    return mission
  }

  async update(updateMissionDto: ApiUpdateMissionDto) {
    const updateMission = plainToInstance(UpdateMissionDto, updateMissionDto, {
      ignoreDecorators: true,
    })
    let mission = await this.missionService.update(updateMission)
    await Promise.all(
      updateMissionDto.rewardRules.map(async (item) => {
        const updateRewardRuleDto = plainToInstance(UpdateRewardRuleDto, item, {
          ignoreDecorators: true,
        })
        updateRewardRuleDto.campaignId = mission.campaignId
        updateRewardRuleDto.missionId = mission.id
        updateRewardRuleDto.typeRule = 'mission'
        await this.rewardRuleService.update(updateRewardRuleDto)
        return item
      }),
    )
    mission = await this.missionService.getById(mission.id, {
      relations: ['rewardRules'],
    })
    return mission
  }

  async findOne(id: number) {
    const mission = await this.missionService.getById(id, {
      relations: ['rewardRules'],
    })
    if (!mission) {
      return new Mission()
    }
    mission.rewardRules = mission.rewardRules.filter(
      (item) => item.typeRule == 'mission',
    )

    return mission
  }
}
