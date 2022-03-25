import { Injectable, Logger } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import {
  IGiveRewardToUser,
  JudgmentCondition,
  UserCondition,
  Target,
} from '../interfaces/missions.interface'
import { ExternalUserService } from '@lib/external-user'
import { EVENTS, GRANT_TARGET_USER } from '@lib/mission'
import * as moment from 'moment-timezone'
import { MissionsService } from '../missions.service'
import { RewardRuleService, TYPE_RULE } from '@lib/reward-rule'

@Injectable()
export class MissionsListener {
  private readonly logger = new Logger(MissionsListener.name)

  constructor(
    private eventEmitter: EventEmitter2,
    private externalUserService: ExternalUserService,
    private missionsService: MissionsService,
    private rewardRuleService: RewardRuleService,
  ) {}

  @OnEvent('give_reward_to_user')
  async handleGiveRewardToUser(data: IGiveRewardToUser) {
    const user = await this.externalUserService.getUserInfo(
      data.messageValue.user_id,
    )
    if (user === null) {
      this.logger.error(
        `[EVENT ${EVENTS[data.eventName]}]. Wrong user info: ${JSON.stringify(
          user,
        )}`,
      )
      return
    }

    const now = moment().unix()
    const userId = Number(user.id)
    const referredUserId = Number(user.referredById)
    const mission = await this.missionsService.getMissionById(data.missionId)
    const campaign = await this.missionsService.getCampaignById(data.campaignId)

    // Kiểm tra thời gian khả dụng của campaign và mission
    if (!mission || now < campaign.startDate || now > campaign.endDate) {
      this.logger.error(
        `[EVENT ${
          EVENTS[data.eventName]
        }]. Reason: Campaign not found or is over time!`,
      )
      return
    }
    if (!mission || now < mission.openingDate || now > mission.closingDate) {
      this.logger.error(
        `[EVENT ${
          EVENTS[data.eventName]
        }]. Reason: Mission not found or is over time!`,
      )
      return
    }
    // Kiểm tra điều kiện Judgment của mission xem user có thỏa mãn ko
    // const checkJudgmentConditions =
    //   this.missionsService.checkJudgmentConditions(
    //     mission.judgmentConditions as unknown as JudgmentCondition[],
    //     data.messageValue,
    //   )
    // if (!checkJudgmentConditions) {
    //   this.logger.error(
    //     `[EVENT ${
    //       EVENTS[data.eventName]
    //     }]. Reason: users are not eligible to participate ` +
    //       `in the reward - Judgment Condition`,
    //   )
    //   return
    // }

    // Kiểm tra điều kiện User của mission xem user có thỏa mãn ko
    // const checkUserConditions = this.missionsService.checkUserConditions(
    //   mission.userConditions as unknown as UserCondition[],
    //   user,
    // )
    // if (!checkUserConditions) {
    //   this.logger.error(
    //     `[EVENT ${
    //       EVENTS[data.eventName]
    //     }]. Reason: users are not eligible to participate ` +
    //       `in the reward - User Condition`,
    //   )
    //   return
    // }

    // Lấy danh sách phần thưởng theo mission
    const rewardRules = await this.rewardRuleService.find({
      campaignId: data.campaignId,
      missionId: data.missionId,
      typeRule: TYPE_RULE.MISSION,
    })

    // Lấy thông tin tiền thưởng cho từng đối tượng
    const grantTargets = mission.grantTarget as unknown as Target[]
    if (grantTargets.length === 0) {
      this.logger.error(
        `[EVENT ${
          EVENTS[data.eventName]
        }]. Reason: Grant Target was not found!`,
      )
      return
    }
    let mainUser = null,
      referredUser = null
    grantTargets.map((target) => {
      if (target.user === GRANT_TARGET_USER.REFERRAL_USER) referredUser = target
      if (target.user === GRANT_TARGET_USER.USER) mainUser = target
      return target
    })

    if (rewardRules.length === 0) {
      this.logger.error(
        `[EVENT ${EVENTS[data.eventName]}] Mission reward rules was not exist!`,
      )
      return
    }

    const checkLimitReceivedReward =
      await this.missionsService.checkLimitReceivedReward(
        data.missionId,
        userId,
        mission.limitReceivedReward,
      )

    for (const idx in rewardRules) {
      if (
        mainUser !== null &&
        rewardRules[idx].currency === mainUser.currency &&
        rewardRules[idx].key === mainUser.type &&
        checkLimitReceivedReward
      ) {
        // user

        const checkMoneyReward = this.missionsService.checkMoneyReward(
          String(rewardRules[idx].limitValue),
          mainUser.amount,
        )
        if (!checkMoneyReward) {
          this.logger.error(
            `[EVENT ${
              EVENTS[data.eventName]
            }]. Reason: Mission is not enough money to send main user: ${userId}!`,
          )
        } else {
          await this.missionsService.commonFlowReward(
            rewardRules[idx],
            data.campaignId,
            mainUser,
            userId,
            data.missionId,
          )

          const referredUserInfo = {
            ...referredUser,
            referredUserId,
          }
          this.eventEmitter.emit('update_mission_user', {
            userId: userId,
            missionId: data.missionId,
            referredUserInfo,
            eventName: data.eventName,
            moneyEarned: mainUser.amount,
          })
        }
      }

      if (
        referredUser !== null &&
        rewardRules[idx].currency === referredUser.currency &&
        rewardRules[idx].key === referredUser.type &&
        checkLimitReceivedReward
      ) {
        // referred user

        const checkMoneyReward = this.missionsService.checkMoneyReward(
          String(rewardRules[idx].limitValue),
          referredUser.amount,
        )
        if (!checkMoneyReward) {
          this.logger.error(
            `[EVENT ${
              EVENTS[data.eventName]
            }]. Reason: Mission is not enough money to send referred user: ${userId}!`,
          )
        } else {
          await this.missionsService.commonFlowReward(
            rewardRules[idx],
            data.campaignId,
            referredUser,
            referredUserId,
            data.missionId,
          )
        }
      }
    }
  }
}
