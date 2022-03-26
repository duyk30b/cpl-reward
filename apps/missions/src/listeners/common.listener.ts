import { Injectable } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { RewardRuleService } from '@lib/reward-rule'
import { MissionUserLogService } from '@lib/mission-user-log'
import { MissionUserService } from '@lib/mission-user'
import { UpdateMissionUser } from '../interfaces/common.interface'
import { plainToInstance } from 'class-transformer'
import { MissionUserLog } from '@lib/mission-user-log/entities/mission-user-log.entity'
import { CreateMissionUserDto } from '@lib/mission-user/dto/create-mission-user.dto'
import { UpdateMissionUserDto } from '@lib/mission-user/dto/update-mission-user.dto'
import { FixedNumber } from 'ethers'

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

    const fixedMoneyEarned = FixedNumber.fromString(data.moneyEarned)
    const fixedAmount = FixedNumber.fromString(
      data.referredUserInfo === null ? '0' : data.referredUserInfo.amount,
    )
    const fixedTotalMoneyEarned = fixedMoneyEarned.addUnsafe(fixedAmount)

    const missionUserLogData = plainToInstance(
      MissionUserLog,
      {
        missionId: data.missionId,
        userId: data.userId,
        successCount: 1,
        moneyEarned: fixedMoneyEarned.toString(),
        totalMoneyEarned: fixedTotalMoneyEarned.toString(),
        referredUserInfo:
          data.referredUserInfo === null ? {} : data.referredUserInfo,
        note: `event: ${data.eventName} save this log`,
      },
      {
        ignoreDecorators: true,
      },
    )
    const missionUserLog = await this.missionUserLogService.save(
      missionUserLogData,
    )

    if (!missionUser) {
      // create
      const createMissionUser = plainToInstance(
        CreateMissionUserDto,
        missionUserLog,
        {
          ignoreDecorators: true,
          excludeExtraneousValues: true,
        },
      )
      await this.missionUserService.save(createMissionUser)
    } else {
      // update
      const fMuMoneyEarned = FixedNumber.from(missionUser.moneyEarned)
      const fMuTotalMoneyEarned = FixedNumber.from(missionUser.totalMoneyEarned)

      const updateMissionUser = plainToInstance(
        UpdateMissionUserDto,
        missionUserLog,
        {
          ignoreDecorators: true,
          excludeExtraneousValues: true,
        },
      )
      updateMissionUser.successCount = missionUser.successCount + 1
      updateMissionUser.moneyEarned = fixedMoneyEarned
        .addUnsafe(fMuMoneyEarned)
        .toUnsafeFloat()
      updateMissionUser.totalMoneyEarned = fixedTotalMoneyEarned
        .addUnsafe(fMuTotalMoneyEarned)
        .toUnsafeFloat()
      await this.missionUserService.update(missionUser.id, updateMissionUser)
    }
  }
}
