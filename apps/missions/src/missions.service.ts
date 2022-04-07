import { IEvent, IUser } from './interfaces/missions.interface'
import {
  EVENTS,
  GRANT_TARGET_USER,
  GRANT_TARGET_WALLET,
  MISSION_IS_ACTIVE,
  MissionService,
  MISSION_STATUS,
} from '@lib/mission'
import { CommonService } from '@lib/common'
import { Injectable } from '@nestjs/common'
import { Campaign } from '@lib/campaign/entities/campaign.entity'
import {
  CampaignService,
  CAMPAIGN_IS_ACTIVE,
  CAMPAIGN_IS_SYSTEM,
  CAMPAIGN_STATUS,
} from '@lib/campaign'
import { MissionEventService } from '@lib/mission-event'
import { MissionUserService } from '@lib/mission-user'
import { RewardRule } from '@lib/reward-rule/entities/reward-rule.entity'
import {
  USER_REWARD_STATUS,
  UserRewardHistoryService,
} from '@lib/user-reward-history'
import { RewardRuleService, TYPE_RULE } from '@lib/reward-rule'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  IJudgmentCondition,
  IUserCondition,
  IGrantTarget,
} from './interfaces/missions.interface'
import { FixedNumber } from 'ethers'
import * as moment from 'moment-timezone'
import { ExternalUserService } from '@lib/external-user'
import * as Handlebars from 'handlebars'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class MissionsService {
  eventEmit = 'write_log'

  constructor(
    private eventEmitter: EventEmitter2,
    private readonly campaignService: CampaignService,
    private readonly missionService: MissionService,
    private readonly missionEventService: MissionEventService,
    private readonly missionUserService: MissionUserService,
    private readonly rewardRuleService: RewardRuleService,
    private readonly userRewardHistoryService: UserRewardHistoryService,
    private readonly externalUserService: ExternalUserService,
    private readonly configService: ConfigService,
  ) {
    if (this.configService.get<boolean>('debug.enable_save_log')) {
      this.eventEmit = 'write_save_log'
    }
  }

  async mainFunction(data: IEvent) {
    const user = await this.externalUserService.getUserInfo(
      data.msgData.user_id,
    )
    if (user === null) {
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm001',
        data,
        extraData: null,
        params: { name: 'User' },
      })
      return
    }

    const userId = user.id
    const referredUserId =
      user.referredById === undefined ? '0' : user.referredById

    const now = moment().unix()

    // Kiểm tra thời gian khả dụng của campaign
    const campaign = await this.getCampaignById(data.campaignId)
    if (!campaign) {
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm004',
        data,
        extraData: null,
        params: { name: 'Campaign' },
      })
      return
    }
    if (now < campaign.startDate || now > campaign.endDate) {
      await this.campaignService.update({
        id: campaign.id,
        status: CAMPAIGN_STATUS.ENDED,
      })
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm005',
        data,
        extraData: {
          now,
          startDate: campaign.startDate,
          endDate: campaign.endDate,
        },
        params: { name: 'Campaign' },
      })
      return
    }

    // Kiểm tra thời gian khả dụng của mission
    const mission = await this.getMissionById(data.missionId)
    if (!mission) {
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm004',
        data,
        extraData: null,
        params: { name: 'Mission' },
      })
      return
    }
    if (now < mission.openingDate || now > mission.closingDate) {
      await this.missionService.update({
        id: mission.id,
        status: MISSION_STATUS.ENDED,
      })

      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm005',
        data,
        extraData: {
          now,
          openingDate: mission.openingDate,
          closingDate: mission.closingDate,
        },
        params: { name: 'Mission' },
      })
      return
    }

    // Kiểm tra điều kiện Judgment của mission xem user có thỏa mãn ko
    const checkJudgmentConditions = this.checkJudgmentConditions(
      mission.judgmentConditions as unknown as IJudgmentCondition[],
      data.msgData,
      data.msgName,
    )
    if (!checkJudgmentConditions) {
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm006',
        data,
        params: { condition_name: 'Judgment' },
      })
      return
    }

    // Kiểm tra điều kiện User của mission xem user có thỏa mãn ko
    const checkUserConditions = this.checkUserConditions(
      mission.userConditions as unknown as IUserCondition[],
      user,
    )
    if (!checkUserConditions) {
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm006',
        data,
        params: { condition_name: 'User' },
      })
      return
    }

    // Lấy danh sách phần thưởng theo mission
    const rewardRules = await this.rewardRuleService.find({
      campaignId: data.campaignId,
      missionId: data.missionId,
      typeRule: TYPE_RULE.MISSION,
    })
    if (rewardRules.length === 0) {
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm007',
        data,
      })
      return
    }

    // Lấy thông tin tiền thưởng cho từng đối tượng
    const { mainUser, referredUser } = this.getDetailUserFromGrantTarget(
      mission.grantTarget,
    )
    if (mainUser === null && referredUser === null) {
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm001',
        data,
        extraData: null,
        params: { name: 'Grant Target' },
      })
      return
    }

    // check số lần tối đa user nhận thưởng từ mission
    const successCount = await this.getSuccessCount(data.missionId, userId)
    if (successCount > mission.limitReceivedReward) {
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm008',
        data,
        extraData: {
          successCount,
          limitReceivedReward: mission.limitReceivedReward,
        },
      })
      return
    }

    const checkOutOfBudget = this.checkOutOfBudget(
      mission.grantTarget,
      rewardRules,
    )
    if (!checkOutOfBudget) {
      await this.missionService.update({
        id: mission.id,
        status: MISSION_STATUS.OUT_OF_BUDGET,
      })
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm009',
        data,
      })
      return
    }

    for (const idx in rewardRules) {
      const checkMoneyReward = this.checkMoneyReward(
        rewardRules[idx],
        mainUser,
        referredUser,
      )

      if (!checkMoneyReward) {
        this.eventEmitter.emit(this.eventEmit, {
          logLevel: 'warn',
          traceCode: 'm010',
          data,
          extraData: {
            limitValue: rewardRules[idx].limitValue,
            userId,
            mainUserAmount: mainUser === null ? 'N/A' : mainUser.amount,
            referredUserId,
            referredUserAmount:
              referredUser === null ? 'N/A' : referredUser.amount,
          },
        })
        continue
      }

      if (
        mainUser !== null &&
        rewardRules[idx].currency === mainUser.currency &&
        rewardRules[idx].key === mainUser.type
      ) {
        // user
        await this.commonFlowReward(rewardRules[idx], mainUser, userId, data)

        const referredUserInfo =
          referredUserId === 0
            ? null
            : {
                ...referredUser,
                referredUserId,
              }
        this.eventEmitter.emit('update_mission_user', {
          userId: userId,
          missionId: data.missionId,
          referredUserInfo,
          eventName: data.msgName,
          moneyEarned: mainUser.amount,
          limitReceivedReward: mission.limitReceivedReward,
        })
      }

      if (
        referredUserId !== 0 &&
        referredUser !== null &&
        rewardRules[idx].currency === referredUser.currency &&
        rewardRules[idx].key === referredUser.type
      ) {
        // referred user
        await this.commonFlowReward(
          rewardRules[idx],
          referredUser,
          referredUserId,
          data,
        )
      }
    }
  }

  /**
   *
   * @param missionRewardRule
   * @param campaignId
   * @param amount
   * remove type
   * remove currency
   * @param data
   */
  async updateReleaseLimitValue(
    missionRewardRule: RewardRule,
    campaignId: number,
    amount: string,
    data: IEvent,
  ) {
    /**
     * Update value of mission
     * TODO: using transaction to update value in next sprint
     */
    const fixedAmount = FixedNumber.fromString(amount)
    const limitValue = FixedNumber.from(missionRewardRule.limitValue)
      .subUnsafe(fixedAmount)
      .toUnsafeFloat()
    const releaseValue = FixedNumber.from(missionRewardRule.releaseValue)
      .addUnsafe(fixedAmount)
      .toUnsafeFloat()
    const updateMissionRewardRule = await this.rewardRuleService.updateValue(
      missionRewardRule.id,
      releaseValue,
      limitValue,
      fixedAmount.toUnsafeFloat(),
    )
    if (updateMissionRewardRule.affected === 0) {
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm011',
        data,
        extraData: {
          amount,
          missionRewardRule,
        },
      })
    }

    const campaignRewardRule = await this.rewardRuleService.findOne({
      campaignId: campaignId,
      typeRule: TYPE_RULE.CAMPAIGN,
    })
    if (campaignRewardRule !== undefined) {
      campaignRewardRule.releaseValue = FixedNumber.from(
        campaignRewardRule.releaseValue,
      )
        .addUnsafe(fixedAmount)
        .toUnsafeFloat()
      await this.rewardRuleService.onlyUpdate(campaignRewardRule)
    }
    return true
  }

  async commonFlowReward(
    missionRewardRule: RewardRule,
    userTarget: IGrantTarget,
    userId: string,
    data: IEvent,
  ) {
    // update release_value, limit_value of campaign/mission
    /**
     * remove type and currency yet!
     *   userTarget.type,
     *   userTarget.currency,
     */
    const updated = await this.updateReleaseLimitValue(
      missionRewardRule,
      data.campaignId,
      userTarget.amount,
      data,
    )
    if (!updated) return
    const userRewardHistory = await this.userRewardHistoryService.save({
      campaignId: data.campaignId,
      missionId: data.missionId,
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
        eventName: EVENTS[data.msgName],
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
        eventName: EVENTS[data.msgName],
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
        status: USER_REWARD_STATUS.MANUAL_NOT_RECEIVE,
      })
    }
  }

  /**
   * check điều kiện user nhận thưởng 1 lần hay nhiều lần
   *
   * @param missionId
   * @param userId
   */
  async getSuccessCount(missionId: number, userId: string) {
    const missionUser = await this.missionUserService.findOne({
      missionId,
      userId,
    })
    if (missionUser === undefined) return 0
    return missionUser.successCount
  }

  async getMissionsByEvent(eventName: string) {
    return await this.missionEventService.findByEventName(eventName)
  }

  async getCampaignById(campaignId: number): Promise<Campaign> {
    const campaign = await this.campaignService.findOne({
      id: campaignId,
      isActive: CAMPAIGN_IS_ACTIVE.ACTIVE,
      isSystem: CAMPAIGN_IS_SYSTEM.FALSE,
      status: MISSION_STATUS.RUNNING,
    })
    if (!campaign) return null
    return campaign
  }

  async getMissionById(missionId: number) {
    const mission = await this.missionService.findOne({
      id: missionId,
      isActive: MISSION_IS_ACTIVE.ACTIVE,
      status: CAMPAIGN_STATUS.RUNNING,
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
    judgmentConditions: IJudgmentCondition[],
    messageValue: any,
    eventName: string,
  ) {
    if (judgmentConditions.length === 0) return true
    let result = true
    for (const idx in judgmentConditions) {
      const currentCondition = judgmentConditions[idx]
      if (currentCondition.eventName !== EVENTS[eventName]) continue

      const checkExistMessageValue = messageValue[currentCondition.property]
      if (checkExistMessageValue === undefined) continue

      if (
        currentCondition.type === 'number' &&
        !CommonService.compareNumberCondition(
          currentCondition.value,
          messageValue[currentCondition.property],
          currentCondition.operator,
        )
      ) {
        // compare number fail
        result = false
      }

      if (
        currentCondition.type === 'string' &&
        !eval(`'${messageValue[currentCondition.property]}'
                ${currentCondition.operator}
                '${currentCondition.value}'`)
      ) {
        // compare string fail
        result = false
      }

      if (
        currentCondition.type === 'boolean' &&
        !eval(`${messageValue[currentCondition.property]}
                ${currentCondition.operator}
                ${currentCondition.value}`)
      ) {
        // compare boolean and other fail
        result = false
      }

      if (!result) {
        this.eventEmitter.emit('write_log', {
          logLevel: 'warn',
          traceCode: 'm012',
          extraData: {
            eventProperty: currentCondition.property,
            eventValue: messageValue[currentCondition.property],
            operator: currentCondition.operator,
            conditionValue: currentCondition.value,
          },
          params: { name: 'Judgment' },
        })
        break
      }
    }
    return result
  }

  /**
   * @param userConditions
   * @param user
   */
  checkUserConditions(userConditions: IUserCondition[], user: IUser) {
    if (userConditions.length === 0) return true
    let result = true
    for (const idx in userConditions) {
      const currentCondition = userConditions[idx]
      currentCondition.property = CommonService.convertSnakeToCamelStr(
        currentCondition.property,
      )

      const checkExistUserProperty = user[currentCondition.property]
      if (checkExistUserProperty === undefined) continue

      if (
        currentCondition.type === 'number' &&
        !CommonService.compareNumberCondition(
          currentCondition.value,
          user[currentCondition.property],
          currentCondition.operator,
        )
      ) {
        // compare number fail
        result = false
      }

      if (
        currentCondition.type === 'string' &&
        !eval(`'${user[currentCondition.property]}'
                ${currentCondition.operator}
                '${currentCondition.value}'`)
      ) {
        // compare string fail
        result = false
      }

      if (
        currentCondition.type === 'boolean' &&
        !eval(`${user[currentCondition.property]}
                ${currentCondition.operator}
                ${currentCondition.value}`)
      ) {
        // compare boolean and other fail
        result = false
      }

      if (!result) {
        this.eventEmitter.emit('write_log', {
          logLevel: 'warn',
          traceCode: 'm012',
          extraData: {
            eventProperty: currentCondition.property,
            eventValue: user[currentCondition.property],
            operator: currentCondition.operator,
            conditionValue: currentCondition.value,
          },
          params: { name: 'User' },
        })
        break
      }
    }
    return result
  }

  checkMoneyReward(rewardRule: RewardRule, mainUser: any, referredUser: any) {
    const fixedLimitValue = FixedNumber.fromString(
      String(rewardRule.limitValue),
    )
    const fixedMainUserAmount = FixedNumber.fromString(
      mainUser === null || rewardRule.currency !== mainUser.currency
        ? '0'
        : mainUser.amount,
    )
    const fixedReferredUserAmount = FixedNumber.fromString(
      referredUser === null || rewardRule.currency !== referredUser.currency
        ? '0'
        : referredUser.amount,
    )

    return (
      fixedLimitValue
        .subUnsafe(fixedMainUserAmount)
        .subUnsafe(fixedReferredUserAmount)
        .toUnsafeFloat() >= 0
    )
  }

  getDetailUserFromGrantTarget(grantTarget: string) {
    let mainUser = null,
      referredUser = null
    const grantTargets = grantTarget as unknown as IGrantTarget[]
    if (grantTargets.length === 0) return { mainUser, referredUser }
    grantTargets.map((target) => {
      if (target.user === GRANT_TARGET_USER.REFERRAL_USER) referredUser = target
      if (target.user === GRANT_TARGET_USER.USER) mainUser = target
      return target
    })
    return { mainUser, referredUser }
  }

  getLogMessageFromTemplate(templateTxt: string, params: any) {
    const template = Handlebars.compile(templateTxt)
    return template(params)
  }

  checkOutOfBudget(grantTarget: string, rewardRules: RewardRule[]) {
    const grantTargets = grantTarget as unknown as IGrantTarget[]
    const amountsByCurrency = {}
    for (const target of grantTargets) {
      if (
        amountsByCurrency[`${target.type}_${target.currency}`] === undefined
      ) {
        amountsByCurrency[`${target.type}_${target.currency}`] = '0'
      }
      const fixedAmount = FixedNumber.fromString(target.amount)
      amountsByCurrency[`${target.type}_${target.currency}`] =
        FixedNumber.fromString(
          amountsByCurrency[`${target.type}_${target.currency}`],
        )
          .addUnsafe(fixedAmount)
          .toString()
    }
    for (const reward of rewardRules) {
      const fixedLimit = FixedNumber.fromString(String(reward.limitValue))
      const amountByCurrency = FixedNumber.fromString(
        amountsByCurrency[`${reward.key}_${reward.currency}`] === undefined
          ? '0'
          : amountsByCurrency[`${reward.key}_${reward.currency}`],
      )
      if (fixedLimit.subUnsafe(amountByCurrency).toUnsafeFloat() < 0)
        return false
    }
    return true
  }
}
