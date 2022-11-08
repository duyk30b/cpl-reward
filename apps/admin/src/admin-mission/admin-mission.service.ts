import { Injectable } from '@nestjs/common'
import {
  DELIVERY_METHOD_WALLET,
  EVENTS,
  GRANT_METHOD,
  GRANT_TARGET_USER,
  MISSION_STATUS,
  MissionService,
  TARGET_TYPE,
  USER_CONDITION_TYPES,
} from '@lib/mission'
import { RewardRuleService, REWARD_RULE_APPLY_FOR } from '@lib/reward-rule'
import { JudgmentConditionDto } from '@lib/mission/dto/judgment-condition.dto'
import { MissionEventService } from '@lib/mission-event'
import {
  ICreateMission,
  IUpdateMission,
  MissionFilterInput,
} from './admin-mission.interface'
import { TargetDto } from '@lib/mission/dto/target.dto'
import { GrpcMissionDto } from '@lib/mission/dto/grpc-mission.dto'
import { FixedNumber } from 'ethers'
import { UserConditionDto } from '@lib/mission/dto/user-condition.dto'
import { Interval } from '@nestjs/schedule'
import { LessThanOrEqual, MoreThan, Not } from 'typeorm'
import { CampaignService, CAMPAIGN_TYPE } from '@lib/campaign'
import { CommonService, ErrorMessage } from '@lib/common'

@Injectable()
export class AdminMissionService {
  constructor(
    private readonly missionService: MissionService,
    private readonly rewardRuleService: RewardRuleService,
    private readonly missionEventService: MissionEventService,
    private readonly campaignService: CampaignService,
    private readonly commonService: CommonService,
  ) {}

  @Interval(5000)
  async handleIntervalUpdateStatus() {
    const now = CommonService.currentUnixTime()

    // Ended
    await this.missionService.updateStatus(
      {
        closingDate: LessThanOrEqual(now),
      },
      MISSION_STATUS.ENDED,
    )

    // Running
    await this.missionService.updateStatus(
      {
        openingDate: LessThanOrEqual(now),
        closingDate: MoreThan(now),
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

  private updatePropertyToCalculateAmountInTarget(grantTarget: TargetDto[]) {
    return grantTarget.map((target) => {
      if (![GRANT_METHOD.PERCENT.toString()].includes(target.grantMethod)) {
        target.propertyToCalculateAmount = ''
      }
      return target
    })
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

  private updateTypeInUser(userConditions: UserConditionDto[] = []) {
    return userConditions.map((condition) => {
      const property = USER_CONDITION_TYPES[condition.property]
      condition.type =
        property === undefined ? '' : property.original || property.type

      return condition
    })
  }

  private calcMissionsStatus(input: ICreateMission) {
    // checking out_of_budget status
    const onBudget = this.commonService.checkOnBudget(
      input.grantTarget,
      input.rewardRules,
      true,
    )
    if (!onBudget) return MISSION_STATUS.OUT_OF_BUDGET

    // checking time status
    const now = CommonService.currentUnixTime()
    if (now < input.openingDate) return MISSION_STATUS.COMING_SOON
    if (input.openingDate <= now && input.closingDate >= now)
      return MISSION_STATUS.RUNNING
    if (now > input.closingDate) return MISSION_STATUS.ENDED
  }

  private validateRangeTimeCampaign(
    create: ICreateMission | IUpdateMission,
    campaign,
  ) {
    return (
      campaign.startDate <= create.openingDate &&
      campaign.endDate >= create.closingDate
    )
  }

  async create(create: ICreateMission | IUpdateMission) {
    const res = {
      message: '',
      success: true,
      mission: {} as GrpcMissionDto,
    }

    const campaign = await this.campaignService.getById(create.campaignId)
    const validateRangeTime = this.validateRangeTimeCampaign(create, campaign)

    if (!validateRangeTime) {
      res.success = false
      res.message = ErrorMessage.INVALID_MISSION_TIME
      return res
    }

    if (campaign.type === CAMPAIGN_TYPE.ORDER) {
      create.closingDate = campaign.endDate
      create.openingDate = campaign.startDate
      create.displayConditions = []
    }

    const countDuplicatePriority =
      await this.missionService.countDuplicatePriority(
        create.campaignId,
        create.priority,
      )

    if (countDuplicatePriority > 0) {
      res.success = false
      res.message = ErrorMessage.DUPLICATE_MISSION_PRIORITY
      return res
    }

    create.grantTarget = this.updateTypeInTarget(create.grantTarget)
    create.grantTarget = this.updatePropertyToCalculateAmountInTarget(
      create.grantTarget,
    )
    create.targetType = this.getTargetType(create.grantTarget)
    create.judgmentConditions = this.updateTypeInJudgment(
      create.judgmentConditions,
    )
    create.userConditions = this.updateTypeInUser(create.userConditions)
    create.displayConditions = this.updateTypeInUser(create.displayConditions)
    create.status = this.calcMissionsStatus(create)
    const mission = await this.missionService.create(create)
    await Promise.all(
      create.rewardRules.map(async (item) => {
        await this.rewardRuleService.create(item, {
          campaignId: create.campaignId,
          missionId: mission.id,
          typeRule: REWARD_RULE_APPLY_FOR.MISSION,
        })
      }),
    )
    await this.mappingMissionEvent(
      create.judgmentConditions,
      create.campaignId,
      mission.id,
    )

    res.mission = await this.findOne(mission.id)
    return res
  }

  async update(update: IUpdateMission) {
    const res = {
      message: '',
      success: true,
      mission: {} as GrpcMissionDto,
    }

    const campaign = await this.campaignService.getById(update.campaignId)
    const validateRangeTime = this.validateRangeTimeCampaign(update, campaign)

    if (!validateRangeTime) {
      res.success = false
      res.message = ErrorMessage.INVALID_MISSION_TIME
      return res
    }

    if (campaign.type === CAMPAIGN_TYPE.ORDER) {
      update.closingDate = campaign.endDate
      update.openingDate = campaign.startDate
      update.displayConditions = []
    }

    update.grantTarget = this.updateTypeInTarget(update.grantTarget)
    update.targetType = this.getTargetType(update.grantTarget)
    update.judgmentConditions = this.updateTypeInJudgment(
      update.judgmentConditions,
    )
    update.userConditions = this.updateTypeInUser(update.userConditions)
    update.displayConditions = this.updateTypeInUser(update.displayConditions)
    const createdRewardRules = await this.rewardRuleService.find({
      where: {
        missionId: update.id,
      },
    })

    update.rewardRules.forEach((rule) => {
      const existedRule = createdRewardRules.find((item) => item.id === rule.id)
      if (existedRule) {
        rule.releaseValue = existedRule.releaseValue.toString()
      }
    })

    update.status = this.calcMissionsStatus(update)
    const result = await this.missionService.updateMissionWithUniquePriority(
      update,
    )

    if (result.affected === 0) {
      res.success = false
      res.message = ErrorMessage.DUPLICATE_MISSION_PRIORITY
      return res
    }

    await Promise.all(
      update.rewardRules.map(async (item) => {
        if (item.releaseValue) {
          delete item.releaseValue
        }

        await this.rewardRuleService.update(item, {
          campaignId: update.campaignId,
          missionId: update.id,
          typeRule: REWARD_RULE_APPLY_FOR.MISSION,
        })
        return item
      }),
    )
    await this.mappingMissionEvent(
      update.judgmentConditions,
      update.campaignId,
      update.id,
    )

    res.mission = await this.findOne(update.id)
    return res
  }

  async findOne(id: number) {
    const mission = await this.missionService.getById(id, {
      relations: ['rewardRules'],
    })
    if (!mission) {
      return {} as GrpcMissionDto
    }

    const grpcMission = mission as unknown as GrpcMissionDto
    grpcMission.rewardRules
      .filter((item) => item.typeRule == REWARD_RULE_APPLY_FOR.MISSION)
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
      where: {
        campaignId: input.campaignId,
      },
      relations: ['rewardRules'],
    })

    return { missions: missions }
  }
}
