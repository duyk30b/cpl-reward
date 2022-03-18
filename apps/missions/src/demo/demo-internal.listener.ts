import { Injectable, Logger } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { DemoService } from './demo.service'
import {
  AuthUserLoginInput,
  JudgmentCondition,
  Target,
  UserCondition,
} from './demo.interface'
import { GRANT_TARGET_USER } from '@lib/mission'
import { UserRewardHistoryService } from '@lib/user-reward-history'
import { RewardRuleService, TYPE_RULE } from '@lib/reward-rule'
import { MissionsService } from '../missions.service'

@Injectable()
export class DemoInternalListener {
  private readonly logger = new Logger(DemoInternalListener.name)

  constructor(
    private eventEmitter: EventEmitter2,
    private readonly demoService: DemoService,
    private readonly userRewardHistoryService: UserRewardHistoryService,
    private readonly rewardRuleService: RewardRuleService,
    private readonly missionsService: MissionsService,
  ) {}

  @OnEvent('auth_user_login')
  async handleAuthUserLoginEvent(data: AuthUserLoginInput) {
    const userId = Number(data.user.id)
    const referredUserId = Number(data.user.referredById)
    const mission = await this.demoService.getMissionById(data.missionId)
    const campaign = await this.demoService.getCampaignById(data.campaignId)
    if (!mission || !campaign) {
      this.logger.error('Campaign or Mission not exist!!!')
      return
    }

    // TODO: check số tiền còn lại của campaign/mission

    // TODO: check time con lai cua campaign/mission

    // TODO: check điều kiện user nhận thưởng 1 lần hay nhiều lần

    // Kiểm tra điều kiện Judgment của mission xem user có thỏa mãn ko
    const checkJudgmentConditions =
      this.missionsService.checkJudgmentConditions(
        mission.judgmentConditions as unknown as JudgmentCondition[],
        data.messageValue,
      )
    if (!checkJudgmentConditions) {
      this.logger.error('Judgment conditions were not pass!!')
      return
    }

    // Kiểm tra điều kiện User của mission xem user có thỏa mãn ko
    const checkUserConditions = this.missionsService.checkUserConditions(
      mission.userConditions as unknown as UserCondition[],
      data.user,
    )
    if (!checkUserConditions) {
      this.logger.error('User conditions were not pass!!')
      return
    }

    // Lấy danh sách phần thưởng theo mission
    const missionRewardRules = await this.rewardRuleService.find({
      campaignId: data.campaignId,
      missionId: data.missionId,
      typeRule: TYPE_RULE.MISSION,
    })

    // Lấy thông tin tiền thưởng cho từng đối tượng
    const grantTargets = mission.grantTarget as unknown as Target[]
    if (grantTargets.length === 0) {
      this.logger.error('GrantTargets not exist!!!')
      return
    }
    let user = null,
      referredUser = null
    grantTargets.map((target) => {
      if (target.user === GRANT_TARGET_USER.REFERRAL_USER) referredUser = target
      if (target.user === GRANT_TARGET_USER.USER) user = target
      return target
    })

    if (missionRewardRules.length === 0) {
      this.logger.error('Mission reward rules was not exist!!!')
      return
    }

    for (const idx in missionRewardRules) {
      if (
        user !== null &&
        missionRewardRules[idx].currency === user.currency &&
        missionRewardRules[idx].key === user.type
      ) {
        // user

        await this.demoService.commonFlowReward(
          missionRewardRules[idx],
          data.campaignId,
          user,
          userId,
          data.missionId,
        )

        const referredUserInfo = {
          ...referredUser,
          referredUserId: referredUserId,
        }
        this.eventEmitter.emit('update_mission_user', {
          userId: userId,
          missionId: data.missionId,
          referredUserInfo,
          eventName: 'auth_user_login',
          moneyEarned: user.amount,
        })
      }

      if (
        referredUser !== null &&
        missionRewardRules[idx].currency === referredUser.currency &&
        missionRewardRules[idx].key === referredUser.type
      ) {
        // referred user

        await this.demoService.commonFlowReward(
          missionRewardRules[idx],
          data.campaignId,
          referredUser,
          referredUserId,
          data.missionId,
        )
      }
    }
  }
}
