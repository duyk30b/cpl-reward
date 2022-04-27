import { IEvent, IUser } from './interfaces/missions.interface'
import {
  EVENTS,
  GRANT_TARGET_USER,
  DELIVERY_METHOD_WALLET,
  MISSION_IS_ACTIVE,
  MissionService,
  MISSION_STATUS,
} from '@lib/mission'
import {
  CommonService,
  EventEmitterType,
  MissionUserLogNoteCode,
  MissionUserLogStatus,
} from '@lib/common'
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
import { UserRewardHistoryService } from '@lib/user-reward-history'
import { RewardRuleService, TYPE_RULE } from '@lib/reward-rule'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  IJudgmentCondition,
  IUserCondition,
} from './interfaces/missions.interface'
import { IGrantTarget } from '@lib/common/common.interface'
import { FixedNumber } from 'ethers'
import * as moment from 'moment-timezone'
import { ExternalUserService } from '@lib/external-user'
import { IUpdateMissionUser } from './interfaces/common.interface'
import { plainToInstance } from 'class-transformer'
import { CreateMissionUserDto } from '@lib/mission-user/dto/create-mission-user.dto'

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
    private readonly commonService: CommonService,
  ) {}

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

    // Kiểm tra điều kiện hiển thị
    const displayConditions =
      mission.displayConditions === null ? [] : mission.displayConditions
    const checkDisplayConditions = this.checkUserConditions(
      displayConditions as unknown as IUserCondition[],
      user,
    )
    if (!checkDisplayConditions) {
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm019',
        data,
        params: { condition_name: 'User' },
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

    const checkOutOfBudget = this.commonService.checkOutOfBudget(
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

    // Lấy thông tin tiền thưởng cho từng đối tượng
    const { mainUser, referredUser } = this.getDetailUserFromGrantTarget(
      mission.grantTarget,
    )
    if (mainUser === undefined && referredUser === undefined) {
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm001',
        data,
        extraData: null,
        params: { name: 'Grant Target' },
      })
      return
    }

    if (mainUser === undefined) {
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm001',
        data,
        extraData: null,
        params: { name: 'MainUser GrantTarget' },
      })
      return
    }

    // trả thưởng cho main user
    let isCompleteRewardMainUser = false
    // check số lần tối đa user nhận thưởng từ mission
    const successCount = await this.getSuccessCount(data.missionId, userId)
    if (successCount >= mission.limitReceivedReward) {
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm008',
        data,
        extraData: {
          successCount,
          limitReceivedReward: mission.limitReceivedReward,
        },
      })
    } else {
      // loop reward để trả thưởng cho main user
      for (const rewardRuleKey in rewardRules) {
        if (
          rewardRules[rewardRuleKey].currency !== mainUser.currency ||
          rewardRules[rewardRuleKey].key !== mainUser.type
        )
          continue

        const checkMoneyRewardMain = this.checkMoneyReward(
          rewardRules[rewardRuleKey],
          mainUser,
          referredUser,
          'user',
        )

        if (!checkMoneyRewardMain.status) {
          this.eventEmitter.emit(this.eventEmit, {
            logLevel: 'warn',
            traceCode: 'm010',
            data,
            extraData: {
              currency: rewardRules[rewardRuleKey].currency,
              limitValue: rewardRules[rewardRuleKey].limitValue,
              releaseValue: rewardRules[rewardRuleKey].releaseValue,
              userId,
              mainUserAmount: mainUser.amount,
              referredUserId,
              referredUserAmount:
                referredUser === undefined ? 'N/A' : referredUser.amount,
            },
            params: { source: checkMoneyRewardMain.source },
          })
          break
        }

        const updatedSuccessCount = await this.updateSuccessCount({
          userId,
          limitReceivedReward: mission.limitReceivedReward,
          userType: GRANT_TARGET_USER.USER,
          userTarget: mainUser,
          data,
        })

        if (!updatedSuccessCount) {
          this.eventEmitter.emit(this.eventEmit, {
            logLevel: 'warn',
            traceCode: 'm017',
            data,
          })
          break
        }

        // user
        isCompleteRewardMainUser = await this.commonFlowReward(
          rewardRules[rewardRuleKey].id,
          mainUser,
          userId,
          data,
          referredUserId,
        )
      }
    }

    // nếu trả thưởng không thành công cho main user thì cũng không trả thưởng cho refered user
    if (!isCompleteRewardMainUser) {
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm014',
        data,
        extraData: null,
        params: { type: 'MainUser' },
      })
      return
    }

    // referred user không tồn tại
    if (referredUserId === '0' || referredUser === undefined) {
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm001',
        data,
        extraData: null,
        params: { name: 'ReferredUser GrantTarget' },
      })
      return
    }

    // loop reward để trả thưởng cho referred user
    for (const rewardRuleKey in rewardRules) {
      if (
        rewardRules[rewardRuleKey].currency !== referredUser.currency ||
        rewardRules[rewardRuleKey].key !== referredUser.type
      )
        continue

      const checkMoneyRewardReferred = this.checkMoneyReward(
        rewardRules[rewardRuleKey],
        mainUser,
        referredUser,
        'referred_user',
      )

      if (!checkMoneyRewardReferred.status) {
        this.eventEmitter.emit(this.eventEmit, {
          logLevel: 'warn',
          traceCode: 'm010',
          data,
          extraData: {
            currency: rewardRules[rewardRuleKey].currency,
            limitValue: rewardRules[rewardRuleKey].limitValue,
            releaseValue: rewardRules[rewardRuleKey].releaseValue,
            userId,
            mainUserAmount: mainUser.amount,
            referredUserId,
            referredUserAmount: referredUser.amount,
          },
          params: { source: checkMoneyRewardReferred.source },
        })
        break
      }

      const updatedSuccessCount = await this.updateSuccessCount({
        userId: referredUserId,
        limitReceivedReward: mission.limitReceivedReward,
        userType: GRANT_TARGET_USER.REFERRAL_USER,
        userTarget: referredUser,
        data,
      })

      if (!updatedSuccessCount) {
        this.eventEmitter.emit(this.eventEmit, {
          logLevel: 'warn',
          traceCode: 'm017',
          data,
        })
        break
      }

      // referred user
      await this.commonFlowReward(
        rewardRules[rewardRuleKey].id,
        referredUser,
        referredUserId,
        data,
      )
    }
  }

  async commonFlowReward(
    rewardRuleId: number,
    userTarget: IGrantTarget,
    userId: string,
    data: IEvent,
    referrerUserId = null,
  ) {
    // Lưu số tiền phát ra, sử dụng transaction để tránh việc phát ra nhiều hơn con số limit (khi bị flood request)
    const updated = await this.rewardRuleService.safeIncreaseReleaseValue(
      rewardRuleId,
      userTarget.amount,
    )

    // Đang thống kê theo cách cộng tổng mission nên chưa cần lưu theo campaign. Nếu cần lưu thì emit event này
    // this.eventEmitter.emit('update_value_reward_campaign', {.........})

    if (updated.affected === 0) {
      // Log: increased success_count but failed to release reward, because of out of budget
      this.eventEmitter.emit(EventEmitterType.CREATE_MISSION_USER_LOG, {
        campaignId: data.campaignId,
        missionId: data.missionId,
        userId: userId,
        successCount: 0,
        moneyEarned: userTarget.amount,
        note: JSON.stringify({
          event: data.msgName,
          result: 'Failed to raise reward after increase success count',
          statusCode: MissionUserLogNoteCode.FAILED_RAISE_REWARD,
        }),
        userType: userTarget.user,
        currency: userTarget.currency,
        wallet: DELIVERY_METHOD_WALLET[userTarget.wallet],
        status: MissionUserLogStatus.IGNORE,
      })

      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'error',
        traceCode: 'm011',
        data,
        extraData: {
          userTarget,
        },
      })
      return false
    }

    // Lưu thống kê tiền xuất ra xong, bắt đầu đi gửi tiền.
    const { wallet, deliveryMethod } = this.missionService.getWalletFromTarget(
      userTarget.wallet,
    )
    const userRewardHistory = await this.userRewardHistoryService.save({
      campaignId: data.campaignId,
      missionId: data.missionId,
      userId,
      userType: userTarget.user,
      amount: userTarget.amount,
      currency: userTarget.currency,
      wallet,
      deliveryMethod,
      referrerUserId,
    })
    if (!userRewardHistory) return false
    if (
      DELIVERY_METHOD_WALLET[userTarget.wallet] ===
        DELIVERY_METHOD_WALLET.DIRECT_BALANCE &&
      userRewardHistory
    ) {
      this.eventEmitter.emit('send_reward_to_balance', {
        id: userRewardHistory.id,
        userId: userId,
        amount: userTarget.amount,
        currency: userTarget.currency,
        type: 'reward',
        data,
        userType: userTarget.user,
      })
    }
    if (
      DELIVERY_METHOD_WALLET[userTarget.wallet] ===
        DELIVERY_METHOD_WALLET.DIRECT_CASHBACK &&
      userRewardHistory
    ) {
      this.eventEmitter.emit('send_reward_to_cashback', {
        id: userRewardHistory.id,
        userId: userId,
        amount: userTarget.amount,
        currency: userTarget.currency,
        historyId: userRewardHistory.id,
        data,
        userType: userTarget.user,
      })
    }
    return true
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
    let errorCondition = null
    for (const idx in judgmentConditions) {
      const currentCondition = judgmentConditions[idx]
      if (currentCondition.eventName !== EVENTS[eventName]) continue

      const checkExistMessageValue = messageValue[currentCondition.property]
      if (checkExistMessageValue === undefined) {
        errorCondition = currentCondition
        result = false
        break
      }

      if (
        currentCondition.type === 'unix_timestamp' &&
        !eval(`${messageValue[currentCondition.property]}
                ${currentCondition.operator}
                ${Number(currentCondition.value)}`)
      ) {
        // compare timestamp fail
        errorCondition = currentCondition
        result = false
        break
      }

      if (
        currentCondition.type === 'number' &&
        !CommonService.compareNumberCondition(
          currentCondition.value,
          messageValue[currentCondition.property],
          currentCondition.operator,
        )
      ) {
        // compare number fail
        errorCondition = currentCondition
        result = false
        break
      }

      if (
        currentCondition.type === 'string' &&
        !eval(`'${messageValue[currentCondition.property]}'
                ${currentCondition.operator}
                '${currentCondition.value}'`)
      ) {
        // compare string fail
        errorCondition = currentCondition
        result = false
        break
      }

      if (
        currentCondition.type === 'boolean' &&
        !eval(`${messageValue[currentCondition.property]}
                ${currentCondition.operator}
                ${currentCondition.value}`)
      ) {
        // compare boolean and other fail
        errorCondition = currentCondition
        result = false
        break
      }
    }

    if (!result && errorCondition !== null) {
      this.eventEmitter.emit('write_log', {
        logLevel: 'warn',
        traceCode: 'm012',
        extraData: {
          eventProperty: errorCondition.property,
          eventValue: messageValue[errorCondition.property],
          operator: errorCondition.operator,
          conditionValue: errorCondition.value,
        },
        params: { name: 'Judgment' },
      })
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
    let errorCondition = null
    for (const idx in userConditions) {
      const currentCondition = userConditions[idx]
      currentCondition.property = CommonService.convertSnakeToCamelStr(
        currentCondition.property,
      )

      const checkExistUserProperty = user[currentCondition.property]
      if (checkExistUserProperty === undefined) {
        // exist condition but data input not exist this property
        errorCondition = currentCondition
        result = false
        break
      }

      if (
        currentCondition.type === 'number' &&
        !CommonService.compareNumberCondition(
          currentCondition.value,
          user[currentCondition.property],
          currentCondition.operator,
        )
      ) {
        // compare number fail
        errorCondition = currentCondition
        result = false
        break
      }

      if (
        currentCondition.type === 'string' &&
        !eval(`'${user[currentCondition.property]}'
                ${currentCondition.operator}
                '${currentCondition.value}'`)
      ) {
        // compare string fail
        errorCondition = currentCondition
        result = false
        break
      }

      if (
        currentCondition.type === 'boolean' &&
        !eval(`${user[currentCondition.property]}
                ${currentCondition.operator}
                ${currentCondition.value}`)
      ) {
        // compare boolean and other fail
        errorCondition = currentCondition
        result = false
        break
      }
    }

    if (!result && errorCondition !== null) {
      this.eventEmitter.emit('write_log', {
        logLevel: 'warn',
        traceCode: 'm012',
        extraData: {
          eventProperty: errorCondition.property,
          eventValue: user[errorCondition.property],
          operator: errorCondition.operator,
          conditionValue: errorCondition.value,
        },
        params: { name: 'User' },
      })
    }

    return result
  }

  checkMoneyReward(
    rewardRule: RewardRule,
    mainUser: any,
    referredUser: any,
    type: string,
  ) {
    const fixedLimitValue = FixedNumber.fromString(
      String(rewardRule.limitValue),
    )
    const fixedReleaseValue = FixedNumber.fromString(
      String(rewardRule.releaseValue),
    )

    if (fixedLimitValue.subUnsafe(fixedReleaseValue).toUnsafeFloat() <= 0)
      return {
        status: false,
        source: `1 - ${type}`,
      }

    const fixedMainUserAmount = FixedNumber.fromString(
      mainUser === undefined || rewardRule.currency !== mainUser.currency
        ? '0'
        : mainUser.amount,
    )
    const fixedReferredUserAmount = FixedNumber.fromString(
      referredUser === undefined ||
        rewardRule.currency !== referredUser.currency
        ? '0'
        : referredUser.amount,
    )
    return {
      status:
        fixedLimitValue
          .subUnsafe(fixedReleaseValue)
          .subUnsafe(fixedMainUserAmount)
          .subUnsafe(fixedReferredUserAmount)
          .toUnsafeFloat() >= 0,
      source: `2 - ${type}`,
    }
  }

  getDetailUserFromGrantTarget(grantTarget: string) {
    let mainUser = undefined,
      referredUser = undefined
    const grantTargets = grantTarget as unknown as IGrantTarget[]
    if (grantTargets.length === 0) return undefined
    grantTargets.map((target) => {
      if (target.user === GRANT_TARGET_USER.REFERRAL_USER) referredUser = target
      if (target.user === GRANT_TARGET_USER.USER) mainUser = target
      return target
    })
    return { mainUser, referredUser }
  }

  transformEventData(msgData: any, msgName: string) {
    const typeOfProperties = this.missionService.getInfoEventsByKey(
      EVENTS[msgName],
    )
    if (!typeOfProperties) {
      return msgData
    }

    for (const property in msgData) {
      if (typeof msgData[property] === 'object') {
        delete msgData[property]
        continue
      }
      if (
        !typeOfProperties[property] ||
        typeOfProperties[property] !== 'unix_timestamp'
      ) {
        continue
      }

      // transform property has datetime type
      if (
        moment(String(msgData[property]), 'YYYY-MM-DD HH:mm:ss', true).isValid()
      ) {
        msgData[property] = moment(String(msgData[property])).valueOf()
        continue
      }
      // transform property has timestamp type
      if (String(msgData[property]).length < 13)
        msgData[property] = Number(msgData[property]) * 1000
    }
    return msgData
  }

  async updateSuccessCount(updateMissionUser: IUpdateMissionUser) {
    try {
      const missionUser = await this.missionUserService.findOne({
        missionId: updateMissionUser.data.missionId,
        userId: updateMissionUser.userId,
        campaignId: updateMissionUser.data.campaignId,
        userType: updateMissionUser.userType,
      })
      const createMissionUserLogData = {
        missionId: updateMissionUser.data.missionId,
        userId: updateMissionUser.userId,
        campaignId: updateMissionUser.data.campaignId,
        successCount: 1,
        moneyEarned: FixedNumber.fromString(
          updateMissionUser.userTarget.amount,
        ).toString(),
        note: `event: ${updateMissionUser.data.msgName} save this log`,
        userType: updateMissionUser.userTarget.user,
        currency: updateMissionUser.userTarget.currency,
      }
      if (missionUser === undefined) {
        try {
          // create
          const createMissionUserData = plainToInstance(
            CreateMissionUserDto,
            createMissionUserLogData,
            {
              ignoreDecorators: true,
              excludeExtraneousValues: true,
            },
          )
          await this.missionUserService.save(createMissionUserData)

          return true
        } catch (error) {
          // retry update if failed to create
          const existedMissionUser = await this.missionUserService.findOne({
            missionId: updateMissionUser.data.missionId,
            userId: updateMissionUser.userId,
            campaignId: updateMissionUser.data.campaignId,
          })

          if (existedMissionUser === undefined) {
            return false
          }

          const updated = await this.missionUserService.increaseSuccessCount(
            existedMissionUser.id,
            updateMissionUser.limitReceivedReward,
          )

          return updated.affected > 0
        }
      }

      // update
      const updated = await this.missionUserService.increaseSuccessCount(
        missionUser.id,
        updateMissionUser.limitReceivedReward,
      )

      return updated.affected > 0
    } catch (error) {
      return false
    }
  }
}
