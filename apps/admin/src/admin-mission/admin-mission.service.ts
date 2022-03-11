import { Injectable } from '@nestjs/common'
import { EVENTS, MissionService } from '@lib/mission'
import { RewardRuleService, TYPE_RULE } from '@lib/reward-rule'
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
          typeRule: TYPE_RULE.MISSION,
        })
      }),
    )
    // await this.mappingMissionEvent(
    //   createMissionInput.judgmentConditions,
    //   createMissionInput.campaignId,
    //   mission.id,
    // )
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
          typeRule: TYPE_RULE.MISSION,
        })
        return item
      }),
    )
    // await this.mappingMissionEvent(
    //   updateMissionInput.judgmentConditions,
    //   updateMissionInput.campaignId,
    //   mission.id,
    // )
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

  // TODO: update later
  private async mappingMissionEvent(
    judgmentConditions: JudgmentConditionDto[],
    campaignId: number,
    missionId: number,
  ) {
    const arrEvents = Object.keys(EVENTS).map(function (event) {
      return EVENTS[event]
    })
    const availableEvents = []
    const infoEvents = []
    judgmentConditions.forEach((item) => {
      if (
        arrEvents.includes(item.eventName) &&
        !availableEvents.includes(item.eventName)
      ) {
        availableEvents.push(item.eventName)
        infoEvents.push({
          campaignId,
          missionId,
          eventName: item.eventName,
        })
      }
    })
    await Promise.all(
      infoEvents.map(async (item) => {
        if (arrEvents.includes(item.eventName)) {
          await this.missionEventService.upsert({
            campaignId: item.campaignId,
            missionId: item.missionId,
            eventName: item.eventName,
          })
        }
        return item
      }),
    )
  }
}
