import { Injectable } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { RewardRuleService } from '@lib/reward-rule'
import { MissionUserLogService } from '@lib/mission-user-log'
import { MissionUserService } from '@lib/mission-user'
import { UpdateMissionUser } from '../demo/demo.interface'
import { EventMissionUserLog } from '@lib/common/interfaces/event-mission-user-log'
import { plainToInstance } from 'class-transformer'
import { MissionUserLog } from '@lib/mission-user-log/entities/mission-user-log.entity'

@Injectable()
export class CommonListener {
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly rewardRuleService: RewardRuleService,
    private readonly missionUserLogService: MissionUserLogService,
    private readonly missionUserService: MissionUserService,
  ) {}

  @OnEvent('update_mission_user')
  async handleMissionUser(data: UpdateMissionUser) {
    const missionUser = await this.missionUserService.getOneMissionUser({
      missionId: data.missionId,
      userId: data.userId,
    })
    if (!missionUser) {
      // create
      await this.missionUserService.save({
        missionId: data.missionId,
        userId: data.userId,
        successCount: 1,
        moneyEarned: data.moneyEarned,
        totalMoneyEarned: data.moneyEarned + data.referredUserInfo.amount,
        referredUserInfo: data.referredUserInfo,
      })
    } else {
      // update
      await this.missionUserService.update(data.missionId, data.userId, {
        successCount: missionUser.successCount + 1,
        moneyEarned: missionUser.moneyEarned + data.moneyEarned,
        totalMoneyEarned:
          missionUser.totalMoneyEarned +
          data.moneyEarned +
          data.referredUserInfo.amount,
        referredUserInfo: data.referredUserInfo,
      })
    }
    // TODO: do not call below event
    this.eventEmitter.emit(`event_log_${data.eventName}`, {
      note: '123',
      missionUser,
    })
  }

  @OnEvent('event_log_*')
  async handleCampaignLog(event: EventMissionUserLog) {
    const missionUserLog = plainToInstance(MissionUserLog, event.missionUser, {
      ignoreDecorators: true,
      excludePrefixes: ['id'],
    })
    missionUserLog.note = event.note
    await this.missionUserLogService.save(missionUserLog)
  }
}
