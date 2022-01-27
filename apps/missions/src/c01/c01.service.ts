import { Injectable, Logger, Inject, OnModuleInit } from '@nestjs/common'
import { MissionUserService } from '@app/mission-user'
import { MissionService } from '@app/mission'
import missionConfig from './c01.config'
import { currentUnixTime } from '@app/common/utils'
import BaseMissionService from '@app/common/mission-service.abtract'
import { MissionUser } from '@app/mission-user/entities/mission-user.entity'
import { Mission } from '@app/mission/entities/mission.entity'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { HlUserSpendMoney } from '@app/common/interfaces/hl-user-spend-money'
import { EventMissionUserLog } from '@app/common/interfaces/event-mission-user-log'
import InternalService from '@app/affiliate-internal/interfaces/internal.service.interface'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { verifyResponse } from './c01.interface'

@Injectable()
export class C01Service implements BaseMissionService, OnModuleInit {
  private readonly logger = new Logger(C01Service.name)
  private internalService: InternalService

  constructor(
    private readonly missionUserService: MissionUserService,
    private readonly missionService: MissionService,
    private readonly eventEmitter: EventEmitter2,
    @Inject('INTERNAL_PACKAGE') private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.internalService =
      this.client.getService<InternalService>('InternalService')
  }

  async main(eventName: string, message: any) {
    // Step 1: Insert user to mission
    const mission = await this.getById(missionConfig.id)
    if (!mission) {
      this.logger.debug(missionConfig.id + ' not found')
      return
    }

    const missionUser = await this.upsertMissionUser(eventName, message)
    if (!missionUser) {
      return
    }

    if (!(await this.isActiveCampaign(mission))) {
      return
    }

    // Step 2: Check if user conquer the reward
    const conquerReward = await this.isConquerReward(mission, missionUser)
    if (!conquerReward) {
      return
    }

    // Step 3: Call official external service to confirm
    const verifyConquerReward = await this.verify(mission, missionUser)
    if (verifyConquerReward === null) {
      return
    }

    // Step 4: Call external service to give reward
    const giveRewardSuccess = await this.give(
      mission,
      missionUser,
      verifyConquerReward.parentUserId,
    )
    if (!giveRewardSuccess) {
      return
    }

    // Step 5: Update mission stats
    // this.updateStats(missionUser)
  }

  async upsertMissionUser(eventName: string, data: any): Promise<MissionUser> {
    // Switch event
    let missionUser = null
    switch (eventName) {
      case 'hl_user_spend_money':
        missionUser = await this.userSpendMoney(missionConfig.id, data)
        break
      default:
        break
    }

    return missionUser
  }

  async isConquerReward(mission: Mission, missionUser: MissionUser) {
    return missionUser.data['total_hl_money'] >= 50
  }

  async isUserCanJoinCampaign(
    mission: Mission,
    userId: number,
  ): Promise<boolean> {
    // Get mission user
    const missionUser = await this.missionUserService.getMissionUser(
      mission.id,
      userId,
    )
    if (!missionUser) {
      return true
    }

    //
    if (missionUser.isBanned) {
      return false
    }

    // Reach reward count or money limit
    // if (
    //   missionUser.successCount >= mission.limitUserReward ||
    //   missionUser.successCount >= mission.limitSystemReward ||
    //   missionUser.moneyEarned >= mission.limitUserMoney ||
    //   missionUser.moneyEarned >= mission.limitSystemMoney
    // ) {
    //   return false
    // }

    // Check if user has referer

    return true
  }

  async isActiveCampaign(mission: Mission): Promise<boolean> {
    // Campaign is disabled
    // if (!mission.active) {
    //   return false
    // }

    // Preparing data
    // if (mission.prepareDataRequired && !mission.prepareDataDone) {
    //   return false
    // }

    // Out of time range
    const nowUnixTime = currentUnixTime('second')
    // if (mission.startDate > nowUnixTime || mission.endDate < nowUnixTime) {
    //   return false
    // }

    // Reach limit of reward of money
    // if (
    //   (mission.limitSystemReward > 0 &&
    //     mission.releasedReward >= mission.limitSystemReward) ||
    //   (mission.limitSystemMoney > 0 &&
    //     mission.releasedMoney >= mission.limitSystemMoney)
    // ) {
    //   return false
    // }

    return true
  }

  async userSpendMoney(
    missionId: number,
    data: HlUserSpendMoney,
  ): Promise<MissionUser> {
    const logEventName = missionConfig.eventLogPrefix + 'userSpendMoney'
    let isNewUser = false
    let missionUser = await this.missionUserService.getMissionUser(
      missionId,
      data.userId,
    )

    if (!missionUser) {
      isNewUser = true
      missionUser = new MissionUser()
      missionUser.data = { total_hl_money: 0 } as any
      missionUser.userId = data.userId
      missionUser.missionId = missionId
    }

    const oldHlMoney = missionUser.data['total_hl_money']
    missionUser.data['total_hl_money'] = oldHlMoney + data.amount

    const savedMissionUser = await this.missionUserService.save(missionUser)
    // Write mission user log
    const eventMissionUserLog = new EventMissionUserLog()
    eventMissionUserLog.name = logEventName
    eventMissionUserLog.isNewUser = isNewUser
    eventMissionUserLog.missionUser = savedMissionUser
    eventMissionUserLog.extraData = { hlUserSpendMoney: data }
    this.eventEmitter.emit(logEventName, eventMissionUserLog)

    return savedMissionUser
  }

  // async updateStats(missionUser: MissionUser) {
  //   return await this.missionService.updateStats(
  //     missionUser.missionId,
  //     missionConfig.rewardMoney,
  //     1,
  //   )
  // }

  async getById(missionId) {
    return await this.missionService.getById(missionId)
  }

  async verify(
    mission: Mission,
    missionUser: MissionUser,
  ): Promise<verifyResponse> {
    const { id } = await lastValueFrom(
      this.internalService.findParent({ id: +missionUser.userId }),
    )
    if (id === 0) return null
    return {
      parentUserId: id,
    }
  }

  async give(mission: Mission, missionUser: MissionUser, parentUserId: number) {
    this.logger.debug('da trao thuong =)')
    return true
  }
}
