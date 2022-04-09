import { Injectable } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { RewardRuleService } from '@lib/reward-rule'
import { MissionUserLogService } from '@lib/mission-user-log'
import { MissionUserService } from '@lib/mission-user'
import {
  ICreateMissionUserLog,
  IUpdateMissionUser,
} from '../interfaces/common.interface'
import { plainToInstance } from 'class-transformer'
import { CreateMissionUserDto } from '@lib/mission-user/dto/create-mission-user.dto'
import { UpdateMissionUserDto } from '@lib/mission-user/dto/update-mission-user.dto'
import { FixedNumber } from 'ethers'
import { CreateMissionUserLogDto } from '@lib/mission-user-log/dto/create-mission-user-log.dto'

@Injectable()
export class CommonListener {
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly rewardRuleService: RewardRuleService,
    private readonly missionUserLogService: MissionUserLogService,
    private readonly missionUserService: MissionUserService,
  ) {}

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
  async handleMissionUser(data: IUpdateMissionUser) {
    const fixedMoneyEarned = FixedNumber.fromString(data.moneyEarned)
    const fixedAmount = FixedNumber.fromString(
      data.referredUserInfo === undefined ? '0' : data.referredUserInfo.amount,
    )
    const fixedTotalMoneyEarned = fixedMoneyEarned.addUnsafe(fixedAmount)

    const missionUser = await this.missionUserService.findOne({
      missionId: data.missionId,
      userId: data.userId,
    })
    const createMissionUserLogData = {
      missionId: data.missionId,
      userId: data.userId,
      successCount: 1,
      moneyEarned: fixedMoneyEarned.toString(),
      totalMoneyEarned: fixedTotalMoneyEarned.toString(),
      referredUserInfo:
        data.referredUserInfo === undefined ? {} : data.referredUserInfo,
      note: `event: ${data.eventName} save this log`,
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
      const fMuMoneyEarned = FixedNumber.from(missionUser.moneyEarned)
      const fMuTotalMoneyEarned = FixedNumber.from(missionUser.totalMoneyEarned)

      const updateMissionUserData = plainToInstance(
        UpdateMissionUserDto,
        {
          successCount: missionUser.successCount + 1,
          moneyEarned: fixedMoneyEarned
            .addUnsafe(fMuMoneyEarned)
            .toUnsafeFloat(),
          totalMoneyEarned: fixedTotalMoneyEarned
            .addUnsafe(fMuTotalMoneyEarned)
            .toUnsafeFloat(),
          referredUserInfo:
            data.referredUserInfo === undefined ? {} : data.referredUserInfo,
        },
        {
          ignoreDecorators: true,
          excludeExtraneousValues: true,
        },
      )
      const updated = await this.missionUserService.update(
        missionUser.id,
        updateMissionUserData,
        data.limitReceivedReward,
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
