import { Injectable, Logger } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { DemoService } from './demo.service'
import {
  AuthUserLoginInput,
  JudgmentCondition,
  Target,
  UserCondition,
} from './demo.interface'
import { GRANT_TARGET_USER, GRANT_TARGET_WALLET } from '@lib/mission'
import { UserRewardHistoryService } from '@lib/user-reward-history'
import { RewardRuleService } from '@lib/reward-rule'

@Injectable()
export class DemoInternalListener {
  private readonly logger = new Logger(DemoInternalListener.name)

  constructor(
    private eventEmitter: EventEmitter2,
    private readonly demoService: DemoService,
    private readonly userRewardHistoryService: UserRewardHistoryService,
    private readonly rewardRuleService: RewardRuleService,
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

    // TODO: check số tiền còn lại của campaign

    // TODO: check điều kiện user nhận thưởng 1 lần hay nhiều lần

    const checkJudgmentConditions = this.demoService.checkJudgmentConditions(
      mission.judgmentConditions as unknown as JudgmentCondition[],
      data.messageValue,
    )
    if (!checkJudgmentConditions) {
      this.logger.error('Judgment conditions were not pass!!')
      return
    }

    const checkUserConditions = this.demoService.checkUserConditions(
      mission.userConditions as unknown as UserCondition[],
      data.user,
    )
    if (!checkUserConditions) {
      this.logger.error('User conditions were not pass!!')
      return
    }

    const rewardRules = await this.demoService.getRulesByIds(
      data.campaignId,
      data.missionId,
    )
    const grantTargets = mission.grantTarget as unknown as Target[]

    if (rewardRules.length === 0 || grantTargets.length === 0) {
      this.logger.error('RewardRules or GrantTargets not exist!!!')
      return
    }
    let user, referredUser
    grantTargets.map((target) => {
      if (target.user === GRANT_TARGET_USER.REFERRAL_USER) referredUser = target
      if (target.user === GRANT_TARGET_USER.USER) user = target
      return target
    })

    for (const idx in rewardRules) {
      if (
        user !== null &&
        rewardRules[idx].currency === user.currency &&
        rewardRules[idx].key === user.type
      ) {
        // user
        const updateRewardRule = await this.rewardRuleService.updateValue(
          rewardRules[idx],
          user.amount,
        )
        if (updateRewardRule.affected === 0) {
          this.logger.error(
            `Update Value of Reward Rule fail, ` +
              `input: rewardRule => ${JSON.stringify(rewardRules[idx])}` +
              `, amount => ${user.amount}`,
          )
        }

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

        const userRewardHistory = await this.userRewardHistoryService.save({
          campaignId: data.campaignId,
          missionId: data.missionId,
          userId,
          userType: user.user,
          amount: user.amount,
          currency: user.currency,
          wallet: GRANT_TARGET_WALLET[user.wallet],
        })

        if (
          GRANT_TARGET_WALLET[referredUser.wallet] ===
            GRANT_TARGET_WALLET.DIRECT_BALANCE &&
          userRewardHistory
        ) {
          this.eventEmitter.emit('send_reward_to_balance', {
            id: userRewardHistory.id,
            userId,
            amount: user.amount,
            currency: user.currency,
            // TODO: recheck below value
            type: 'balance',
          })
        }
      }

      if (
        referredUser !== null &&
        rewardRules[idx].currency === referredUser.currency &&
        rewardRules[idx].key === referredUser.type
      ) {
        // referred user
        const updateRewardRule = await this.rewardRuleService.updateValue(
          rewardRules[idx],
          referredUser.amount,
        )
        if (updateRewardRule.affected === 0) {
          this.logger.error(
            `Update Value of Reward Rule fail, ` +
              `input: rewardRule => ${JSON.stringify(rewardRules[idx])}` +
              `, amount => ${referredUser.amount}`,
          )
        }

        const userRewardHistory = await this.userRewardHistoryService.save({
          campaignId: data.campaignId,
          missionId: data.missionId,
          userId: referredUserId,
          userType: referredUser.user,
          amount: referredUser.amount,
          currency: referredUser.currency,
          wallet: GRANT_TARGET_WALLET[referredUser.wallet],
        })

        if (
          GRANT_TARGET_WALLET[referredUser.wallet] ===
            GRANT_TARGET_WALLET.DIRECT_BALANCE &&
          userRewardHistory
        ) {
          this.eventEmitter.emit('send_reward_to_balance', {
            id: userRewardHistory.id,
            userId: referredUserId,
            amount: referredUser.amount,
            currency: referredUser.currency,
            // TODO: recheck below value
            type: 'balance',
          })
        }
      }
    }
  }
}
