import {
  IEvent,
  IJudgmentCondition,
  IUserCondition,
} from './interfaces/missions.interface'
import {
  DELIVERY_METHOD_WALLET,
  EVENTS,
  GRANT_TARGET_USER,
  MISSION_IS_ACTIVE,
  MISSION_STATUS,
  MissionService,
  DELIVERY_METHOD,
} from '@lib/mission'
import {
  CommonService,
  EventEmitterType,
  MissionUserLogNoteCode,
  MissionUserLogStatus,
} from '@lib/common'
import { Injectable } from '@nestjs/common'
import { CAMPAIGN_STATUS, CampaignService, CAMPAIGN_TYPE } from '@lib/campaign'
import { MissionEventService } from '@lib/mission-event'
import { MissionUserService } from '@lib/mission-user'
import { RewardRule } from '@lib/reward-rule/entities/reward-rule.entity'
import {
  UserRewardHistoryService,
  USER_REWARD_STATUS,
} from '@lib/user-reward-history'
import { RewardRuleService, REWARD_RULE_APPLY_FOR } from '@lib/reward-rule'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { IGrantTarget } from '@lib/common/common.interface'
import { FixedNumber } from 'ethers'
import * as moment from 'moment-timezone'
import { ExternalUserService } from '@lib/external-user'
import { IUpdateMissionUser } from './interfaces/common.interface'
import { plainToInstance } from 'class-transformer'
import { CreateMissionUserDto } from '@lib/mission-user/dto/create-mission-user.dto'
import { IdGeneratorService } from '@lib/id-generator'
import { QUEUE_SEND_BALANCE, QUEUE_SEND_CASHBACK } from '@lib/queue'
import {
  SendRewardToBalance,
  SendRewardToCashback,
} from './interfaces/external.interface'
import { Mission } from '@lib/mission/entities/mission.entity'
import { User } from '@lib/external-user/user.interface'
import { QueueService } from '@lib/queue/queue.service'
import { Campaign } from '@lib/campaign/entities/campaign.entity'

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
    private readonly idGeneratorService: IdGeneratorService,
    private readonly queueService: QueueService,
  ) {}

  async mainFunction(data: IEvent) {
    // Kiểm tra tính khả dụng của campaign
    const campaign = await this.campaignService.getRunningCampaignById(
      data.campaignId,
    )
    if (!campaign) {
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'debug',
        traceCode: 'm004',
        data,
        extraData: null,
        params: { name: 'Campaign' },
      })
      return
    }

    if (campaign.type === CAMPAIGN_TYPE.ORDER) {
      // check last reward in ordering campaign
      const lastReward =
        await this.userRewardHistoryService.getLastRewardByCampaignId(
          campaign.id,
          data.msgData.user_id,
        )

      const claimable = this.commonService.checkValidCheckinTime(
        campaign,
        moment().unix(),
        lastReward,
      )

      if (!claimable) {
        this.eventEmitter.emit(this.eventEmit, {
          logLevel: 'warn',
          traceCode: 'm006',
          data,
          params: { condition_name: 'Claimable time' },
        })
        return
      }
    }

    // Kiểm tra tính khả dụng của mission
    const { mission, rewardRules } = await this.syncMissionStatus(
      data.missionId,
      campaign,
    )
    if (!mission || mission.status !== MISSION_STATUS.RUNNING) {
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'debug',
        traceCode: 'm004',
        data,
        extraData: null,
        params: { name: 'Mission' },
      })
      return
    }

    if (rewardRules.length === 0) {
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'error',
        traceCode: 'm007',
        data,
        extraData: mission,
      })
      return
    }

    if (campaign.type === CAMPAIGN_TYPE.ORDER) {
      // check next previous mission passed or not
      const previousMission = await this.missionService.getPreviousOrderMission(
        campaign.id,
        mission.priority,
        data.msgData.user_id,
      )

      if (previousMission.some((item) => !item.successNumber)) {
        this.eventEmitter.emit(this.eventEmit, {
          logLevel: 'warn',
          traceCode: 'm006',
          data,
          params: { condition_name: 'Previous mission' },
        })
        return
      }
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

    const user = await this.externalUserService.getUserInfo(
      data.msgData.user_id,
    )
    if (!user) {
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
    const referredUserId = user.referredById || '0'

    // Kiểm tra điều kiện hiển thị
    // const displayConditions =
    //   mission.displayConditions === null ? [] : mission.displayConditions
    // const checkDisplayConditions = this.checkUserConditions(
    //   displayConditions as unknown as IUserCondition[],
    //   user,
    // )
    // if (!checkDisplayConditions) {
    //   this.eventEmitter.emit(this.eventEmit, {
    //     logLevel: 'warn',
    //     traceCode: 'm019',
    //     data,
    //     params: { condition_name: 'User' },
    //   })
    //   return
    // }

    // Kiểm tra điều kiện User của mission xem user có thỏa mãn ko
    const checkUserConditions = this.missionService.checkUserConditions(
      mission.userConditions as unknown as IUserCondition[],
      user,
      true,
    )
    if (!checkUserConditions) {
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm006',
        data: user,
        extraData: mission.userConditions,
        params: { condition_name: 'User' },
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

    // Check số lần tối đa user nhận thưởng từ mission
    const successCount = await this.getSuccessCount(
      data.missionId,
      userId,
      GRANT_TARGET_USER.USER,
    )
    if (mainUser !== undefined && successCount >= mission.limitReceivedReward) {
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

    // trả thưởng cho main user
    let isCompleteRewardMainUser = true
    // loop reward để trả thưởng cho main user
    if (mainUser !== undefined) {
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
          isCompleteRewardMainUser = false
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
          isCompleteRewardMainUser = false
          break
        }

        // user
        isCompleteRewardMainUser = await this.commonFlowReward(
          rewardRules[rewardRuleKey].id,
          mainUser,
          userId,
          data,
          referredUserId,
          campaign,
        )
      }
    } else {
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'log',
        traceCode: 'm001',
        data,
        extraData: null,
        params: { name: 'MainUser GrantTarget' },
      })
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

    if (referredUserId !== '0' && referredUser !== undefined) {
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
              mainUserAmount: mainUser === undefined ? 'N/A' : mainUser.amount,
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
          null,
          campaign,
        )
      }
    }
    //else {
    // Đoạn này ko có Ref user thì thôi ko cần ghi log
    //   this.eventEmitter.emit(this.eventEmit, {
    //     logLevel: 'log',
    //     traceCode: 'm001',
    //     data,
    //     extraData: null,
    //     params: { name: 'ReferredUser GrantTarget' },
    //   })
    // }

    // Update lại status của reward một lần nữa
    await this.syncMissionStatus(mission.id, campaign)
  }

  async commonFlowReward(
    rewardRuleId: number,
    userTarget: IGrantTarget,
    userId: string,
    data: IEvent,
    referrerUserId = null,
    campaign: Campaign,
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

    const referenceId = this.idGeneratorService.generateSnowflakeId()
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
      referenceId,
      status:
        deliveryMethod === DELIVERY_METHOD.MANUAL
          ? USER_REWARD_STATUS.NEED_TO_REDEEM
          : USER_REWARD_STATUS.DEFAULT_STATUS,
      createdAt:
        campaign.type === CAMPAIGN_TYPE.ORDER ? data.msgData.created_at : null,
    })
    if (!userRewardHistory) {
      this.eventEmitter.emit(EventEmitterType.CREATE_MISSION_USER_LOG, {
        campaignId: data.campaignId,
        missionId: data.missionId,
        userId: userId,
        successCount: 0,
        moneyEarned: userTarget.amount,
        note: JSON.stringify({
          event: data.msgName,
          result: 'Failed to create reward history after release reward',
          statusCode: MissionUserLogNoteCode.FAILED_CREATE_HISTORY,
        }),
        userType: userTarget.user,
        currency: userTarget.currency,
        wallet: DELIVERY_METHOD_WALLET[userTarget.wallet],
        status: MissionUserLogStatus.IGNORE,
      })

      return false
    }
    if (
      DELIVERY_METHOD_WALLET[userTarget.wallet] ===
        DELIVERY_METHOD_WALLET.DIRECT_BALANCE &&
      userRewardHistory
    ) {
      const balanceBody = plainToInstance(SendRewardToBalance, {
        id: userRewardHistory.id,
        userId: userId,
        amount: userTarget.amount,
        currency: userTarget.currency,
        type: 'reward',
        data,
        userType: userTarget.user,
        referenceId,
      })
      await this.queueService.addSendMoneyJob(
        userId,
        QUEUE_SEND_BALANCE,
        0,
        balanceBody,
      )
    }
    if (
      DELIVERY_METHOD_WALLET[userTarget.wallet] ===
        DELIVERY_METHOD_WALLET.DIRECT_CASHBACK &&
      userRewardHistory
    ) {
      const cashbackBody = plainToInstance(SendRewardToCashback, {
        id: userRewardHistory.id,
        userId: userId,
        amount: userTarget.amount,
        currency: userTarget.currency,
        historyId: userRewardHistory.id,
        data,
        userType: userTarget.user,
        referenceId,
      })
      await this.queueService.addSendMoneyJob(
        userId,
        QUEUE_SEND_CASHBACK,
        2,
        cashbackBody,
      )
    }
    return true
  }

  /**
   * check điều kiện user nhận thưởng 1 lần hay nhiều lần
   *
   * @param missionId
   * @param userId
   * @param userType
   */
  async getSuccessCount(missionId: number, userId: string, userType: string) {
    const missionUser = await this.missionUserService.findOne({
      missionId,
      userId,
      userType,
    })
    if (missionUser === undefined) return 0
    return missionUser.successCount
  }

  async getMissionsByEvent(eventName: string) {
    return await this.missionEventService.findByEventName(eventName)
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
            userType: updateMissionUser.userType,
          })

          if (existedMissionUser === undefined) {
            return false
          }

          const updated = await this.missionUserService.increaseSuccessCount(
            existedMissionUser.id,
            updateMissionUser.limitReceivedReward,
            updateMissionUser.userType,
          )

          return updated.affected > 0
        }
      }

      // update
      const updated = await this.missionUserService.increaseSuccessCount(
        missionUser.id,
        updateMissionUser.limitReceivedReward,
        updateMissionUser.userType,
      )

      return updated.affected > 0
    } catch (error) {
      return false
    }
  }

  // TODO: Logic tính mission status trùng với hàm calcMissionsStatus, nên gộp làm 1
  async syncMissionStatus(
    missionId: number,
    campaign: Campaign,
  ): Promise<{ mission: Mission; rewardRules: RewardRule[] }> {
    let rewardRules = []
    let mission = await this.getMissionById(missionId)
    if (!mission) {
      return { mission: null, rewardRules: [] }
    }
    let missionStatus = mission.status

    rewardRules = await this.rewardRuleService.find({
      campaignId: mission.campaignId,
      missionId: mission.id,
      typeRule: REWARD_RULE_APPLY_FOR.MISSION,
    })

    if (rewardRules.length === 0) {
      return {
        mission: mission,
        rewardRules: rewardRules,
      }
    }

    // Calculate mission status
    const onBudget = this.commonService.checkOnBudget(
      mission.grantTarget,
      rewardRules,
    )
    if (!onBudget) {
      missionStatus = MISSION_STATUS.OUT_OF_BUDGET
      // this.eventEmitter.emit(this.eventEmit, {
      //   logLevel: 'warn',
      //   traceCode: 'm009',
      //   mission,
      // })
    } else {
      const now = CommonService.currentUnixTime()
      let openingDate = mission.openingDate
      let closingDate = mission.closingDate
      if (campaign.type === CAMPAIGN_TYPE.ORDER) {
        openingDate = campaign.startDate
        closingDate = campaign.endDate
      }

      if (now < openingDate) {
        missionStatus = MISSION_STATUS.COMING_SOON
      }
      if (openingDate <= now && closingDate >= now) {
        missionStatus = MISSION_STATUS.RUNNING
      }
      if (now > closingDate) {
        missionStatus = MISSION_STATUS.ENDED
      }
    }

    // Update if mission status changed
    if (missionStatus != mission.status) {
      mission = await this.missionService.update({
        id: mission.id,
        status: missionStatus,
      })
    }

    return {
      mission: mission,
      rewardRules: rewardRules,
    }
  }
}
