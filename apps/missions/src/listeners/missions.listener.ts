import { Injectable, Logger } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import {
  IGiveRewardToUser,
  JudgmentCondition,
  UserCondition,
  IGetEventsByName,
} from '../interfaces/missions.interface'
import { ExternalUserService } from '@lib/external-user'
import { EVENTS, MissionService, STATUS_MISSION } from '@lib/mission'
import * as moment from 'moment-timezone'
import { MissionsService } from '../missions.service'
import { RewardRuleService, TYPE_RULE } from '@lib/reward-rule'
import { CampaignService, STATUS_CAMPAIGN } from '@lib/campaign'

@Injectable()
export class MissionsListener {
  private readonly logger = new Logger(MissionsListener.name)

  constructor(
    private eventEmitter: EventEmitter2,
    private externalUserService: ExternalUserService,
    private missionsService: MissionsService,
    private rewardRuleService: RewardRuleService,
    private missionService: MissionService,
    private campaignService: CampaignService,
  ) {}

  @OnEvent('get_events_by_name')
  async handleGetEventsByName(data: IGetEventsByName) {
    const events = await this.missionsService.getEventsByName(
      EVENTS[data.eventName],
    )
    if (events.length === 0) {
      this.logger.log(
        `[EVENT ${EVENTS[data.eventName]}] no mission/campaign in event.`,
      )
      return
    }
    events.map((event) => {
      this.eventEmitter.emit('give_reward_to_user', {
        messageValueData: data.messageValueData,
        missionId: event.missionId,
        campaignId: event.campaignId,
        eventName: data.eventName,
      })
    })
  }

  @OnEvent('give_reward_to_user')
  async handleGiveRewardToUser(data: IGiveRewardToUser) {
    const user = await this.externalUserService.getUserInfo(
      data.messageValueData.user_id,
    )
    if (user === null) {
      this.logger.log(
        `[EVENT ${EVENTS[data.eventName]}]. Wrong user info: ${JSON.stringify(
          user,
        )}`,
      )
      return
    }
    const userId = Number(user.id)
    const referredUserId =
      user.referredById === undefined ? 0 : Number(user.referredById)

    const now = moment().unix()

    // Kiểm tra thời gian khả dụng của campaign
    const campaign = await this.missionsService.getCampaignById(data.campaignId)
    if (!campaign) {
      this.logger.log(
        `[EVENT ${
          EVENTS[data.eventName]
        }]. Reason: Campaign was not found!. CampaignId: ${
          data.campaignId
        }, campaign: ${JSON.stringify(campaign)}`,
      )
      return
    }
    if (now < campaign.startDate || now > campaign.endDate) {
      await this.campaignService.update({
        id: campaign.id,
        status: STATUS_CAMPAIGN.ENDED,
      })
      this.logger.log(
        `[EVENT ${
          EVENTS[data.eventName]
        }]. Reason: Campaign was over time!. now: ${now}, campaignId: ${
          campaign.id
        }, startDate: ${campaign.startDate}, endDate: ${campaign.endDate}`,
      )
      return
    }

    // Kiểm tra thời gian khả dụng của mission
    const mission = await this.missionsService.getMissionById(data.missionId)
    if (!mission) {
      this.logger.log(
        `[EVENT ${
          EVENTS[data.eventName]
        }]. Reason: Mission was not found!. MissionId: ${data.missionId}`,
      )
      return
    }
    if (now < mission.openingDate || now > mission.closingDate) {
      await this.missionService.update({
        id: mission.id,
        status: STATUS_MISSION.ENDED,
      })
      this.logger.log(
        `[EVENT ${
          EVENTS[data.eventName]
        }]. Reason: Mission was over time!. now: ${now}, missionId: ${
          mission.id
        }, openDate: ${mission.openingDate}, closeDate: ${mission.closingDate}`,
      )
      return
    }

    // Kiểm tra điều kiện Judgment của mission xem user có thỏa mãn ko
    const checkJudgmentConditions =
      this.missionsService.checkJudgmentConditions(
        mission.judgmentConditions as unknown as JudgmentCondition[],
        data.messageValueData,
        data.eventName,
        mission.id,
      )
    if (!checkJudgmentConditions) {
      this.logger.log(
        `[EVENT ${EVENTS[data.eventName]}]. MissionId: ${
          mission.id
        }. Judgment Condition check fail!`,
      )
      return
    }

    // Kiểm tra điều kiện User của mission xem user có thỏa mãn ko
    const checkUserConditions = this.missionsService.checkUserConditions(
      mission.userConditions as unknown as UserCondition[],
      user,
      data.eventName,
      mission.id,
    )
    if (!checkUserConditions) {
      this.logger.log(
        `[EVENT ${EVENTS[data.eventName]}]. MissionId: ${
          mission.id
        }. User Condition check fail!`,
      )
      return
    }

    // Lấy danh sách phần thưởng theo mission
    const rewardRules = await this.rewardRuleService.find({
      campaignId: data.campaignId,
      missionId: data.missionId,
      typeRule: TYPE_RULE.MISSION,
    })
    if (rewardRules.length === 0) {
      this.logger.log(
        `[EVENT ${EVENTS[data.eventName]}]. MissionId: ${
          mission.id
        }. Mission reward rules was not exist!`,
      )
      return
    }

    // Lấy thông tin tiền thưởng cho từng đối tượng
    const { mainUser, referredUser } =
      this.missionsService.getDetailUserFromGrantTarget(
        mission.grantTarget,
        data.eventName,
      )

    // check số lần tối đa user nhận thưởng từ mission
    const successCount = await this.missionsService.getSuccessCount(
      data.missionId,
      userId,
    )
    if (successCount >= mission.limitReceivedReward) {
      this.logger.log(
        `[EVENT ${EVENTS[data.eventName]}]. MissionId: ${
          mission.id
        }. successCount: ${successCount}, limitReceivedReward: ${
          mission.limitReceivedReward
        }`,
      )
      return
    }

    for (const idx in rewardRules) {
      const checkMoneyReward = this.missionsService.checkMoneyReward(
        rewardRules[idx],
        mainUser,
        referredUser,
      )

      if (!checkMoneyReward) {
        // TODO: confirm requirement
        // await this.missionService.update({
        //   id: mission.id,
        //   status: STATUS_MISSION.OUT_OF_BUDGET,
        // })
        this.logger.log(
          `[EVENT ${EVENTS[data.eventName]}]. ` +
            `MissionId: ${mission.id}. Not enough money. ` +
            `limitValue: ${rewardRules[idx].limitValue}. ` +
            `Main user: ${userId}, amount: ${mainUser.amount}. ` +
            `Referred user: ${referredUserId}, amount: ${
              referredUser === null ? '' : referredUser.amount
            }`,
        )
        continue
      }

      if (
        mainUser !== null &&
        rewardRules[idx].currency === mainUser.currency &&
        rewardRules[idx].key === mainUser.type
      ) {
        // user
        await this.missionsService.commonFlowReward(
          rewardRules[idx],
          data.campaignId,
          mainUser,
          userId,
          data.missionId,
        )

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
          eventName: data.eventName,
          moneyEarned: mainUser.amount,
        })
      }

      if (
        referredUserId !== 0 &&
        referredUser !== null &&
        rewardRules[idx].currency === referredUser.currency &&
        rewardRules[idx].key === referredUser.type
      ) {
        // referred user
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
