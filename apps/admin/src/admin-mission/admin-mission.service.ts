import { Injectable } from '@nestjs/common'
import { EVENTS, MissionService } from '@lib/mission'
import { ApiCreateMissionDto } from './dto/api-create-mission.dto'
import { plainToInstance } from 'class-transformer'
import { CreateRewardRuleDto } from '@lib/reward-rule/dto/create-reward-rule.dto'
import { RewardRuleService } from '@lib/reward-rule'
import { UpdateRewardRuleDto } from '@lib/reward-rule/dto/update-reward-rule.dto'
import { ApiUpdateMissionDto } from './dto/api-update-mission.dto'
import { CreateMissionDto } from '@lib/mission/dto/create-mission.dto'
import { UpdateMissionDto } from '@lib/mission/dto/update-mission.dto'
import { Mission } from '@lib/mission/entities/mission.entity'
import { JudgmentConditionDto } from '@lib/mission/dto/judgment-condition.dto'
import { MissionEventService } from '@lib/mission-event'

@Injectable()
export class AdminMissionService {
  constructor(
    private readonly missionService: MissionService,
    private readonly rewardRuleService: RewardRuleService,
    private readonly missionEventService: MissionEventService,
  ) {}

  async create(createMissionDto: ApiCreateMissionDto) {
    const rewardRules = createMissionDto.rewardRules
    const createMission = plainToInstance(CreateMissionDto, createMissionDto, {
      ignoreDecorators: true,
      excludeExtraneousValues: true,
    })
    let mission = await this.missionService.create(createMission)

    await Promise.all(
      rewardRules.map(async (item) => {
        const createRewardRuleDto = plainToInstance(CreateRewardRuleDto, item, {
          ignoreDecorators: true,
        })
        createRewardRuleDto.campaignId = createMission.campaignId
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
    await this.mappingMissionEvent(
      createMission.judgmentConditions,
      createMission.campaignId,
      mission.id,
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
    await this.mappingMissionEvent(
      updateMission.judgmentConditions,
      updateMission.campaignId,
      mission.id,
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

  private async mappingMissionEvent(
    judgmentConditions: JudgmentConditionDto[],
    campaignId: number,
    missionId: number,
  ) {
    await this.missionEventService.delete(campaignId, missionId)
    await Promise.all(
      judgmentConditions.map(async (item) => {
        if (EVENTS[item.eventName] !== undefined) {
          await this.missionEventService.create({
            campaignId,
            missionId,
            eventName: item.eventName,
          })
        }
      }),
    )
  }
}
