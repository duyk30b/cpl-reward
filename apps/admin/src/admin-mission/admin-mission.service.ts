import { Injectable } from '@nestjs/common'
import { EVENTS, MissionService } from '@lib/mission'
import { RewardRuleService } from '@lib/reward-rule'
import { Mission } from '@lib/mission/entities/mission.entity'
import { JudgmentConditionDto } from '@lib/mission/dto/judgment-condition.dto'
import { MissionEventService } from '@lib/mission-event'
import {
  CreateMissionInput,
  UpdateMissionInput,
} from './admin-mission.interface'

@Injectable()
export class AdminMissionService {
  constructor(
    private readonly missionService: MissionService,
    private readonly rewardRuleService: RewardRuleService,
    private readonly missionEventService: MissionEventService,
  ) {}

  async create(createMissionInput: CreateMissionInput) {
    let mission = await this.missionService.create(createMissionInput)
    await Promise.all(
      createMissionInput.rewardRules.map(async (item) => {
        await this.rewardRuleService.create(item, {
          campaignId: createMissionInput.campaignId,
          missionId: mission.id,
          typeRule: 'mission',
        })
      }),
    )
    await this.mappingMissionEvent(
      createMissionInput.judgmentConditions,
      createMissionInput.campaignId,
      mission.id,
    )
    mission = await this.missionService.getById(mission.id, {
      relations: ['rewardRules'],
    })
    return mission
  }

  async update(updateMissionInput: UpdateMissionInput) {
    let mission = await this.missionService.update(updateMissionInput)
    await Promise.all(
      updateMissionInput.rewardRules.map(async (item) => {
        await this.rewardRuleService.update(item, {
          campaignId: mission.campaignId,
          missionId: mission.id,
          typeRule: 'mission',
        })
        return item
      }),
    )
    await this.mappingMissionEvent(
      updateMissionInput.judgmentConditions,
      updateMissionInput.campaignId,
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
