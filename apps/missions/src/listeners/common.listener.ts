import { Injectable } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { RewardRuleService } from '@lib/reward-rule'
import { MissionUserLogService } from '@lib/mission-user-log'
import { MissionUserService } from '@lib/mission-user'
import {
  ICreateMissionUserLog,
  IUpdateValueRewardCampaign,
} from '../interfaces/common.interface'
import { plainToInstance } from 'class-transformer'
import { CreateMissionUserLogDto } from '@lib/mission-user-log/dto/create-mission-user-log.dto'

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
}
