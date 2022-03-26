import { IUser } from './interfaces/missions.interface'
import {
  EVENTS,
  GRANT_TARGET_USER,
  GRANT_TARGET_WALLET,
  IS_ACTIVE_MISSION,
  MissionService,
  STATUS_MISSION,
} from '@lib/mission'
import { CommonService } from '@lib/common'
import { Injectable, Logger } from '@nestjs/common'
import { Campaign } from '@lib/campaign/entities/campaign.entity'
import {
  CampaignService,
  IS_ACTIVE_CAMPAIGN,
  IS_SYSTEM,
  STATUS_CAMPAIGN,
} from '@lib/campaign'
import { MissionEventService } from '@lib/mission-event'
import { MissionUserService } from '@lib/mission-user'
import { RewardRule } from '@lib/reward-rule/entities/reward-rule.entity'
import { STATUS, UserRewardHistoryService } from '@lib/user-reward-history'
import { RewardRuleService } from '@lib/reward-rule'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  JudgmentCondition,
  UserCondition,
  Target,
} from './interfaces/missions.interface'
import { FixedNumber } from 'ethers'

@Injectable()
export class MissionsService {
  private readonly logger = new Logger(MissionsService.name)

  constructor(
    private eventEmitter: EventEmitter2,
    private readonly campaignService: CampaignService,
    private readonly missionService: MissionService,
    private readonly missionEventService: MissionEventService,
    private readonly missionUserService: MissionUserService,
    private readonly rewardRuleService: RewardRuleService,
    private readonly userRewardHistoryService: UserRewardHistoryService,
  ) {}

  /**
   *
   * @param missionRewardRule
   * @param campaignId
   * @param amount
   * remove type
   * remove currency
   */
  async updateReleaseLimitValue(
    missionRewardRule: RewardRule,
    campaignId: number,
    amount: string,
  ) {
    const updateMissionRewardRule = await this.rewardRuleService.updateValue(
      missionRewardRule,
      amount,
    )
    if (updateMissionRewardRule.affected === 0) {
      this.logger.error(
        `Update Value of Reward Rule fail, ` +
          `input: rewardRule => ${JSON.stringify(missionRewardRule)}` +
          `, amount => ${amount}`,
      )
    }
    // const campaignRewardRules = await this.rewardRuleService.find({
    //   campaignId: campaignId,
    //   typeRule: TYPE_RULE.CAMPAIGN,
    // })
    // if (campaignRewardRules.length > 0) {
    //   for (const idx in campaignRewardRules) {
    //     if (
    //       campaignRewardRules[idx].currency !== currency ||
    //       campaignRewardRules[idx].key !== type
    //     )
    //       continue
    //
    //     await this.rewardRuleService.updateValue(
    //       campaignRewardRules[idx],
    //       amount,
    //     )
    //   }
    // }
  }

  async commonFlowReward(
    missionRewardRule: RewardRule,
    campaignId: number,
    userTarget: Target,
    userId: number,
    missionId: number,
  ) {
    // update release_value, limit_value of campaign/mission
    /**
     * remove type and currency yet!
     *   userTarget.type,
     *   userTarget.currency,
     */
    await this.updateReleaseLimitValue(
      missionRewardRule,
      campaignId,
      userTarget.amount,
    )
    const userRewardHistory = await this.userRewardHistoryService.save({
      campaignId: campaignId,
      missionId: missionId,
      userId,
      userType: userTarget.user,
      amount: userTarget.amount,
      currency: userTarget.currency,
      wallet: GRANT_TARGET_WALLET[userTarget.wallet],
    })
    if (
      GRANT_TARGET_WALLET[userTarget.wallet] ===
        GRANT_TARGET_WALLET.DIRECT_BALANCE &&
      userRewardHistory
    ) {
      this.eventEmitter.emit('send_reward_to_balance', {
        id: userRewardHistory.id,
        userId: userId,
        amount: userTarget.amount,
        currency: userTarget.currency,
        type: 'reward',
      })
    }
    if (
      GRANT_TARGET_WALLET[userTarget.wallet] ===
        GRANT_TARGET_WALLET.DIRECT_CASHBACK &&
      userRewardHistory
    ) {
      this.eventEmitter.emit('send_reward_to_cashback', {
        id: userRewardHistory.id,
        userId: userId,
        amount: userTarget.amount,
        currency: userTarget.currency,
        historyId: userRewardHistory.id,
      })
    }

    if (
      [
        GRANT_TARGET_WALLET.REWARD_BALANCE,
        GRANT_TARGET_WALLET.REWARD_DIVIDEND,
        GRANT_TARGET_WALLET.REWARD_CASHBACK,
      ].includes(GRANT_TARGET_WALLET[userTarget.wallet]) &&
      userRewardHistory
    ) {
      await this.userRewardHistoryService.updateById(userRewardHistory.id, {
        status: STATUS.MANUAL_NOT_RECEIVE,
      })
    }
  }

  /**
   * check điều kiện user nhận thưởng 1 lần hay nhiều lần
   *
   * @param missionId
   * @param userId
   * @param limitReceivedReward
   */
  async checkLimitReceivedReward(
    missionId: number,
    userId: number,
    limitReceivedReward: number,
  ) {
    const missionUser = await this.missionUserService.getOneMissionUser({
      missionId,
      userId,
    })
    if (missionUser === undefined) return true
    return missionUser.successCount < limitReceivedReward
  }

  async getEventsByName(eventName: string) {
    return await this.missionEventService.findByEventName(eventName)
  }

  async getCampaignById(campaignId: number): Promise<Campaign> {
    const campaign = await this.campaignService.findOne({
      id: campaignId,
      isActive: IS_ACTIVE_CAMPAIGN.ACTIVE,
      isSystem: IS_SYSTEM.FALSE,
      status: STATUS_MISSION.RUNNING,
    })
    if (!campaign) return null
    return campaign
  }

  async getMissionById(missionId: number) {
    const mission = await this.missionService.findOne({
      id: missionId,
      isActive: IS_ACTIVE_MISSION.ACTIVE,
      status: STATUS_CAMPAIGN.RUNNING,
    })
    if (!mission) return null
    return mission
  }

  /**
   * @param judgmentConditions
   * @param messageValue
   * @param eventName
   */
  checkJudgmentConditions(
    judgmentConditions: JudgmentCondition[],
    messageValue: any,
    eventName: string,
  ) {
    if (judgmentConditions.length === 0) return true
    let result = false
    for (const idx in judgmentConditions) {
      const currentCondition = judgmentConditions[idx]
      if (currentCondition.eventName !== EVENTS[eventName]) continue

      const checkExistMessageValue = messageValue[currentCondition.property]
      if (checkExistMessageValue === undefined) continue

      const property = CommonService.inspectStringNumber(
        messageValue[currentCondition.property],
        currentCondition.type,
      )
      const operator = currentCondition.operator
      const value = CommonService.inspectStringNumber(
        currentCondition.value,
        currentCondition.type,
      )

      const checkJudgmentCondition = eval(`${property}
      ${operator}
      ${value}`)
      if (!checkJudgmentCondition) {
        this.logger.error(
          `[EVENT ${EVENTS[eventName]}]. Judgement Condition data: ` +
            `eventProperty => ${currentCondition.property}, eventValue => ${property}` +
            `operator => ${operator}, conditionValue => ${value}`,
        )
        break
      }
      result = true
    }
    return result
  }

  /**
   * @param userConditions
   * @param user
   * @param eventName
   */
  checkUserConditions(
    userConditions: UserCondition[],
    user: IUser,
    eventName: string,
  ) {
    if (userConditions.length === 0) return true
    let result = false
    for (const idx in userConditions) {
      const currentCondition = userConditions[idx]
      currentCondition.property = CommonService.convertSnakeToCamelStr(
        currentCondition.property,
      )

      const checkExistUserProperty = user[currentCondition.property]
      if (checkExistUserProperty === undefined) continue

      const property = CommonService.inspectStringNumber(
        user[currentCondition.property],
        currentCondition.type,
      )
      const operator = currentCondition.operator
      const value = CommonService.inspectStringNumber(
        currentCondition.value,
        currentCondition.type,
      )

      const checkUserCondition = eval(`${property}
      ${operator}
      ${value}`)
      if (!checkUserCondition) {
        this.logger.error(
          `[EVENT ${EVENTS[eventName]}]. User Condition data: ` +
            `eventProperty => ${currentCondition.property}, eventValue => ${property}` +
            `operator => ${operator}, conditionValue => ${value}`,
        )
        break
      }
      result = true
    }
    return result
  }

  checkMoneyReward(rewardRule: RewardRule, mainUser: any, referredUser: any) {
    const fixedLimitValue = FixedNumber.fromString(
      String(rewardRule.limitValue),
    )
    const fixedMainUserAmount = FixedNumber.fromString(
      mainUser === null ? '0' : mainUser.amount,
    )
    const fixedReferredUserAmount = FixedNumber.fromString(
      referredUser === null ? '0' : referredUser.amount,
    )

    if (
      rewardRule.currency === mainUser.currency &&
      fixedLimitValue
        .subUnsafe(fixedMainUserAmount)
        .subUnsafe(fixedReferredUserAmount)
        .toUnsafeFloat() <= 0
    )
      return false

    return !(
      rewardRule.currency === referredUser.currency &&
      fixedLimitValue
        .subUnsafe(fixedMainUserAmount)
        .subUnsafe(fixedReferredUserAmount)
        .toUnsafeFloat() <= 0
    )
  }

  getDetailUserFromGrantTarget(grantTarget: string, eventName: string) {
    let mainUser = null,
      referredUser = null
    const grantTargets = grantTarget as unknown as Target[]
    if (grantTargets.length === 0) {
      this.logger.error(
        `[EVENT ${EVENTS[eventName]}]. Reason: Grant Target was not found!`,
      )
      return { mainUser, referredUser }
    }
    grantTargets.map((target) => {
      if (target.user === GRANT_TARGET_USER.REFERRAL_USER) referredUser = target
      if (target.user === GRANT_TARGET_USER.USER) mainUser = target
      return target
    })
    return { mainUser, referredUser }
  }
}
