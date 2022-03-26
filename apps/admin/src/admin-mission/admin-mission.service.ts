import { Injectable } from '@nestjs/common'
import {
  EVENTS,
  GRANT_TARGET_WALLET,
  MissionService,
  STATUS,
  USER_CONDITION_TYPES,
} from '@lib/mission'
import { RewardRuleService, TYPE_RULE } from '@lib/reward-rule'
import { JudgmentConditionDto } from '@lib/mission/dto/judgment-condition.dto'
import { MissionEventService } from '@lib/mission-event'
import {
  CreateMissionInput,
  MissionFilterInput,
  UpdateMissionInput,
} from './admin-mission.interface'
import { TargetDto } from '@lib/mission/dto/target.dto'
import { GrpcMissionDto } from '@lib/mission/dto/grpc-mission.dto'
import { FixedNumber } from 'ethers'
import { UserConditionDto } from '@lib/mission/dto/user-condition.dto'

@Injectable()
export class AdminMissionService {
  constructor(
    private readonly missionService: MissionService,
    private readonly rewardRuleService: RewardRuleService,
    private readonly missionEventService: MissionEventService,
  ) {}

  private updateTypeInTarget(grantTarget: TargetDto[]) {
    return grantTarget.map((target) => {
      if (
        [
          GRANT_TARGET_WALLET.REWARD_BALANCE,
          GRANT_TARGET_WALLET.DIRECT_BALANCE,
        ].includes(GRANT_TARGET_WALLET[target.wallet])
      )
        target.type = 'balance'

      if (
        [
          GRANT_TARGET_WALLET.REWARD_CASHBACK,
          GRANT_TARGET_WALLET.DIRECT_CASHBACK,
        ].includes(GRANT_TARGET_WALLET[target.wallet])
      )
        target.type = 'cashback'

      if (
        [
          GRANT_TARGET_WALLET.REWARD_DIVIDEND,
          GRANT_TARGET_WALLET.DIRECT_DIVIDEND,
        ].includes(GRANT_TARGET_WALLET[target.wallet])
      )
        target.type = 'dividend'
      return target
    })
  }

  private updateTypeInJudgment(judgmentConditions: JudgmentConditionDto[]) {
    const typeOfProperties = this.missionService.getInfoEventsByKey()
    return judgmentConditions.map((condition) => {
      const propertyType =
        typeOfProperties[condition.eventName][condition.property]
      condition.type = propertyType === undefined ? '' : propertyType

      return condition
    })
  }

  private updateTypeInUser(userConditions: UserConditionDto[]) {
    return userConditions.map((condition) => {
      const propertyType = USER_CONDITION_TYPES[condition.property]
      condition.type = propertyType === undefined ? '' : propertyType

      return condition
    })
  }

  async create(createMissionInput: CreateMissionInput) {
    createMissionInput.grantTarget = this.updateTypeInTarget(
      createMissionInput.grantTarget,
    )
    createMissionInput.judgmentConditions = this.updateTypeInJudgment(
      createMissionInput.judgmentConditions,
    )
    createMissionInput.userConditions = this.updateTypeInUser(
      createMissionInput.userConditions,
    )
    const mission = await this.missionService.create(createMissionInput)
    await Promise.all(
      createMissionInput.rewardRules.map(async (item) => {
        await this.rewardRuleService.create(item, {
          campaignId: createMissionInput.campaignId,
          missionId: mission.id,
          typeRule: TYPE_RULE.MISSION,
        })
      }),
    )
    await this.mappingMissionEvent(
      createMissionInput.judgmentConditions,
      createMissionInput.campaignId,
      mission.id,
    )
    return await this.findOne(mission.id)
  }

  async update(updateMissionInput: UpdateMissionInput) {
    updateMissionInput.grantTarget = this.updateTypeInTarget(
      updateMissionInput.grantTarget,
    )
    updateMissionInput.judgmentConditions = this.updateTypeInJudgment(
      updateMissionInput.judgmentConditions,
    )
    updateMissionInput.userConditions = this.updateTypeInUser(
      updateMissionInput.userConditions,
    )
    const mission = await this.missionService.update(updateMissionInput)
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
    await this.mappingMissionEvent(
      updateMissionInput.judgmentConditions,
      updateMissionInput.campaignId,
      mission.id,
    )
    return await this.findOne(mission.id)
  }

  async findOne(id: number) {
    const mission = await this.missionService.getById(id, {
      relations: ['rewardRules'],
    })
    if (!mission) {
      return {}
    }
    const grpcMission = mission as unknown as GrpcMissionDto
    grpcMission.rewardRules
      .filter((item) => item.typeRule == TYPE_RULE.MISSION)
      .map((item) => {
        item.limitValue = FixedNumber.fromString(
          String(item.limitValue),
        ).toString()
        item.releaseValue = FixedNumber.fromString(
          String(item.releaseValue),
        ).toString()
        return item
      })
    return grpcMission
  }

  private async mappingMissionEvent(
    judgmentConditions: JudgmentConditionDto[],
    campaignId: number,
    missionId: number,
  ) {
    await this.missionEventService.deleteByCampaignMission(
      missionId,
      campaignId,
    )

    const arrEvents = Object.keys(EVENTS).map(function (event) {
      return EVENTS[event]
    })
    const infoEvents = []
    judgmentConditions.forEach((item) => {
      if (arrEvents.includes(item.eventName)) {
        const index = arrEvents.indexOf(item.eventName)
        if (index !== -1) arrEvents.splice(index, 1)
        infoEvents.push({
          campaignId,
          missionId,
          eventName: item.eventName,
        })
      }
    })
    await Promise.all(
      infoEvents.map(async (item) => {
        await this.missionEventService.create({
          campaignId: item.campaignId,
          missionId: item.missionId,
          eventName: item.eventName,
        })
        return item
      }),
    )
  }

  async getMissionsByCampaign(input: MissionFilterInput) {
    const missions = await this.missionService.find({
      campaignId: input.campaignId,
      status: STATUS.ACTIVE,
    })

    return { missions: missions }
  }
}
