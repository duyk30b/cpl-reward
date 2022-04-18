import { Injectable } from '@nestjs/common'
import {
  EVENTS,
  GRANT_TARGET_USER,
  DELIVERY_METHOD_WALLET,
  MissionService,
  MISSION_STATUS,
  TARGET_TYPE,
  USER_CONDITION_TYPES,
} from '@lib/mission'
import { RewardRuleService, TYPE_RULE } from '@lib/reward-rule'
import { JudgmentConditionDto } from '@lib/mission/dto/judgment-condition.dto'
import { MissionEventService } from '@lib/mission-event'
import {
  ICreateMission,
  MissionFilterInput,
  IUpdateMission,
} from './admin-mission.interface'
import { TargetDto } from '@lib/mission/dto/target.dto'
import { GrpcMissionDto } from '@lib/mission/dto/grpc-mission.dto'
import { FixedNumber } from 'ethers'
import { UserConditionDto } from '@lib/mission/dto/user-condition.dto'
import * as moment from 'moment-timezone'
import { Interval } from '@nestjs/schedule'
import { LessThanOrEqual, MoreThanOrEqual, Not } from 'typeorm'

@Injectable()
export class AdminMissionService {
  constructor(
    private readonly missionService: MissionService,
    private readonly rewardRuleService: RewardRuleService,
    private readonly missionEventService: MissionEventService,
  ) {}

  @Interval(5000)
  async handleIntervalUpdateStatus() {
    const now = moment().unix()

    await this.missionService.updateStatus(
      { closingDate: LessThanOrEqual(now) },
      MISSION_STATUS.ENDED,
    )
    await this.missionService.updateStatus(
      {
        openingDate: LessThanOrEqual(now),
        closingDate: MoreThanOrEqual(now),
        status: Not(MISSION_STATUS.OUT_OF_BUDGET),
      },
      MISSION_STATUS.RUNNING,
    )
  }

  private getTargetType(grantTarget: TargetDto[]) {
    let isUser = false
    let isReferralUser = false
    grantTarget.map((target) => {
      if (target.user === GRANT_TARGET_USER.USER) isUser = true
      if (target.user === GRANT_TARGET_USER.REFERRAL_USER) isReferralUser = true
    })
    if (isUser && isReferralUser) return TARGET_TYPE.HYBRID
    if (isUser) return TARGET_TYPE.ONLY_MAIN
    return TARGET_TYPE.ONLY_REFERRED
  }

  private updateTypeInTarget(grantTarget: TargetDto[]) {
    return grantTarget.map((target) => {
      if (
        [
          DELIVERY_METHOD_WALLET.REWARD_BALANCE,
          DELIVERY_METHOD_WALLET.DIRECT_BALANCE,
        ].includes(DELIVERY_METHOD_WALLET[target.wallet])
      )
        target.type = 'balance'

      if (
        [
          DELIVERY_METHOD_WALLET.REWARD_CASHBACK,
          DELIVERY_METHOD_WALLET.DIRECT_CASHBACK,
        ].includes(DELIVERY_METHOD_WALLET[target.wallet])
      )
        target.type = 'cashback'

      if (
        [
          DELIVERY_METHOD_WALLET.REWARD_DIVIDEND,
          DELIVERY_METHOD_WALLET.DIRECT_DIVIDEND,
        ].includes(DELIVERY_METHOD_WALLET[target.wallet])
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
      const property = USER_CONDITION_TYPES[condition.property]
      condition.type =
        property === undefined ? '' : property.original || property.type

      return condition
    })
  }

  private static updateStatusByActive(input: ICreateMission) {
    const now = moment().unix()
    if (now < input.openingDate) return MISSION_STATUS.COMING_SOON
    if (input.openingDate <= now && input.closingDate >= now)
      return MISSION_STATUS.RUNNING
    if (now > input.closingDate) return MISSION_STATUS.ENDED
  }

  async create(create: ICreateMission | IUpdateMission) {
    create.grantTarget = this.updateTypeInTarget(create.grantTarget)
    create.targetType = this.getTargetType(create.grantTarget)
    create.judgmentConditions = this.updateTypeInJudgment(
      create.judgmentConditions,
    )
    create.userConditions = this.updateTypeInUser(create.userConditions)
    create.status = AdminMissionService.updateStatusByActive(create)
    const mission = await this.missionService.create(create)
    await Promise.all(
      create.rewardRules.map(async (item) => {
        await this.rewardRuleService.create(item, {
          campaignId: create.campaignId,
          missionId: mission.id,
          typeRule: TYPE_RULE.MISSION,
        })
      }),
    )
    await this.mappingMissionEvent(
      create.judgmentConditions,
      create.campaignId,
      mission.id,
    )
    return await this.findOne(mission.id)
  }

  async update(update: IUpdateMission) {
    update.grantTarget = this.updateTypeInTarget(update.grantTarget)
    update.targetType = this.getTargetType(update.grantTarget)
    update.judgmentConditions = this.updateTypeInJudgment(
      update.judgmentConditions,
    )
    update.userConditions = this.updateTypeInUser(update.userConditions)
    update.status = AdminMissionService.updateStatusByActive(update)
    const mission = await this.missionService.update(update)
    await Promise.all(
      update.rewardRules.map(async (item) => {
        await this.rewardRuleService.update(item, {
          campaignId: mission.campaignId,
          missionId: mission.id,
          typeRule: TYPE_RULE.MISSION,
        })
        return item
      }),
    )
    await this.mappingMissionEvent(
      update.judgmentConditions,
      update.campaignId,
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
          String(item.releaseValue || 0),
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
    })

    return { missions: missions }
  }
}
