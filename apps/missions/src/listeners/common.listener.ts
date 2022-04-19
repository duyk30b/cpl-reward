import { Injectable } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { RewardRuleService, TYPE_RULE } from '@lib/reward-rule'
import { MissionUserLogService } from '@lib/mission-user-log'
import { MissionUserService } from '@lib/mission-user'
import {
  ICreateMissionUserLog,
  IUpdateMissionUser,
  IUpdateValueRewardCampaign,
} from '../interfaces/common.interface'
import { plainToInstance } from 'class-transformer'
import { CreateMissionUserDto } from '@lib/mission-user/dto/create-mission-user.dto'
import { UpdateMissionUserDto } from '@lib/mission-user/dto/update-mission-user.dto'
import { FixedNumber } from 'ethers'
import { CreateMissionUserLogDto } from '@lib/mission-user-log/dto/create-mission-user-log.dto'
import { CreateRewardRuleDto } from '@lib/reward-rule/dto/create-reward-rule.dto'

@Injectable()
export class CommonListener {
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly rewardRuleService: RewardRuleService,
    private readonly missionUserLogService: MissionUserLogService,
    private readonly missionUserService: MissionUserService,
  ) {}

  @OnEvent('update_value_reward_campaign')
  async handleUpdateValRewardCampaign(data: IUpdateValueRewardCampaign) {
    // Hiện tại chỉ limit và thống kê tổng theo mission, ko cần cộng tổng mission vào campaign nên đoạn code dưới bỏ
    return true

    // let rewardRule = await this.rewardRuleService.findOne({
    //   campaignId: data.campaignId,
    //   typeRule: TYPE_RULE.CAMPAIGN,
    //   key: data.key,
    //   currency: data.currency,
    // })
    //
    // if (!rewardRule) {
    //   rewardRule = await this.rewardRuleService.create(
    //     {
    //       key: data.key,
    //       currency: data.currency,
    //       limitValue: '0',
    //       releaseValue: '0',
    //     } as CreateRewardRuleDto,
    //     {
    //       campaignId: data.campaignId,
    //       missionId: null,
    //       typeRule: TYPE_RULE.CAMPAIGN,
    //     },
    //   )
    // }
    //
    // const fixedAmount = FixedNumber.fromString(data.amount)
    // rewardRule.releaseValue = FixedNumber.from(rewardRule.releaseValue)
    //   .addUnsafe(fixedAmount)
    //   .toUnsafeFloat()
    // await this.rewardRuleService.safeUpdateReleaseValue(
    //   rewardRule.id,
    //   rewardRule.releaseValue,
    //   fixedAmount.toUnsafeFloat(),
    // )
  }

  @OnEvent('create_mission_user_log')
  async handleMissionUserLog(data: ICreateMissionUserLog) {
    const createMissionUserLog = plainToInstance(
      CreateMissionUserLogDto,
      data,
      {
        ignoreDecorators: true,
        excludeExtraneousValues: true,
      },
    )
    await this.missionUserLogService.save(createMissionUserLog)
  }

  @OnEvent('update_mission_user')
  async handleMissionUser(updateMissionUser: IUpdateMissionUser) {
    const missionUser = await this.missionUserService.findOne({
      missionId: updateMissionUser.data.missionId,
      userId: updateMissionUser.userId,
      campaignId: updateMissionUser.data.campaignId,
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
      this.eventEmitter.emit(
        'create_mission_user_log',
        createMissionUserLogData,
      )
    } else {
      // update
      const updateMissionUserData = plainToInstance(
        UpdateMissionUserDto,
        {
          successCount: missionUser.successCount + 1,
        },
        {
          ignoreDecorators: true,
          excludeExtraneousValues: true,
        },
      )
      const updated = await this.missionUserService.update(
        missionUser.id,
        updateMissionUserData,
        updateMissionUser.limitReceivedReward,
      )
      if (updated.affected > 0) {
        this.eventEmitter.emit(
          'create_mission_user_log',
          createMissionUserLogData,
        )
      }
    }
  }
}
