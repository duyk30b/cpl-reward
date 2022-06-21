import { Injectable } from '@nestjs/common'
import {
  Mission,
  MissionWithSuccessCount,
} from '@lib/mission/entities/mission.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { paginate, paginateRaw, Pagination } from 'nestjs-typeorm-paginate'
import { CreateMissionDto } from '@lib/mission/dto/create-mission.dto'
import { plainToInstance } from 'class-transformer'
import { UpdateMissionDto } from '@lib/mission/dto/update-mission.dto'
import { CustomPaginationMetaTransformer } from '@lib/common/transformers/custom-pagination-meta.transformer'
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder'
import { IPaginationOptions } from 'nestjs-typeorm-paginate/dist/interfaces'
import { INFO_EVENTS } from '@lib/mission/constants'
import {
  DELIVERY_METHOD,
  DELIVERY_METHOD_WALLET,
  MISSION_IS_ACTIVE,
  MISSION_STATUS,
  WALLET,
} from '@lib/mission/enum'
import { IUserCondition } from '../../../apps/missions/src/interfaces/missions.interface'
import { CommonService } from '@lib/common'
import { User } from '@lib/external-user/user.interface'
import { CAMPAIGN_IS_ACTIVE, CAMPAIGN_STATUS } from '@lib/campaign'
import { Campaign } from '@lib/campaign/entities/campaign.entity'
import { GRANT_TARGET_USER } from '.'
import { json } from 'stream/consumers'

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
  ) {}

  async updateStatus(criteria: any, status: number) {
    await this.missionRepository.update(criteria, { status })
  }

  async getById(id: number, options = undefined): Promise<Mission> {
    return await this.missionRepository.findOne(id, options)
  }

  async findOne(options): Promise<Mission> {
    return await this.missionRepository.findOne(options)
  }

  async update(updateMissionDto: UpdateMissionDto): Promise<Mission> {
    const updateMission = plainToInstance(UpdateMissionDto, updateMissionDto, {
      ignoreDecorators: true,
      excludeExtraneousValues: true,
    })
    const missionEntity = plainToInstance(Mission, updateMission, {
      ignoreDecorators: true,
    })
    return await this.missionRepository.save(missionEntity)
  }

  async create(createMissionDto: CreateMissionDto): Promise<Mission> {
    const createMission = plainToInstance(CreateMissionDto, createMissionDto, {
      ignoreDecorators: true,
      excludeExtraneousValues: true,
    })
    const missionEntity = plainToInstance(Mission, createMission, {
      ignoreDecorators: true,
    })
    return await this.missionRepository.save(missionEntity)
  }

  initQueryBuilder(): SelectQueryBuilder<Mission> {
    return this.missionRepository.createQueryBuilder('mission')
  }

  private queryBuilder(): SelectQueryBuilder<Mission> {
    const queryBuilder = this.missionRepository.createQueryBuilder('mission')
    queryBuilder.orderBy('mission.id', 'DESC')
    queryBuilder.leftJoinAndSelect(
      'mission.rewardRules',
      'rewardRules',
      "rewardRules.type_rule = 'mission'",
    )
    return queryBuilder
  }

  async missionPaginate(
    options: IPaginationOptions<CustomPaginationMetaTransformer>,
    queryBuilder: SelectQueryBuilder<Mission> = null,
    isRaw = false,
  ): Promise<Pagination<Mission, CustomPaginationMetaTransformer> | any> {
    if (queryBuilder === null) queryBuilder = this.queryBuilder()
    if (isRaw) {
      return paginateRaw(queryBuilder, options)
    }
    return paginate<Mission, CustomPaginationMetaTransformer>(
      queryBuilder,
      options,
    )
  }

  async find(conditions: any) {
    return this.missionRepository.find(conditions)
  }

  getInfoEventsByKey(eventName = undefined) {
    const result = {}
    INFO_EVENTS.forEach((item) => {
      if (result[item.eventName] === undefined) result[item.eventName] = {}
      item.properties.forEach((property) => {
        result[item.eventName][property.key] =
          property.original || property.type
      })
    })
    if (eventName !== undefined) return result[eventName]
    return result
  }

  getWalletFromTarget(wallet: string) {
    const result = {
      wallet: undefined,
      deliveryMethod: undefined,
    }
    switch (DELIVERY_METHOD_WALLET[wallet]) {
      case DELIVERY_METHOD_WALLET.REWARD_BALANCE:
        result.wallet = WALLET.BALANCE
        result.deliveryMethod = DELIVERY_METHOD.MANUAL
        break
      case DELIVERY_METHOD_WALLET.REWARD_CASHBACK:
        result.wallet = WALLET.CASHBACK
        result.deliveryMethod = DELIVERY_METHOD.MANUAL
        break
      case DELIVERY_METHOD_WALLET.REWARD_DIVIDEND:
        result.wallet = WALLET.DIVIDEND
        result.deliveryMethod = DELIVERY_METHOD.MANUAL
        break
      case DELIVERY_METHOD_WALLET.DIRECT_BALANCE:
        result.wallet = WALLET.BALANCE
        result.deliveryMethod = DELIVERY_METHOD.AUTO
        break
      case DELIVERY_METHOD_WALLET.DIRECT_CASHBACK:
        result.wallet = WALLET.CASHBACK
        result.deliveryMethod = DELIVERY_METHOD.AUTO
        break
      case DELIVERY_METHOD_WALLET.DIRECT_DIVIDEND:
        result.wallet = WALLET.DIVIDEND
        result.deliveryMethod = DELIVERY_METHOD.AUTO
        break
    }
    return result
  }

  // TODO: Hàm này bị lặp code so với missions.service của repo mission
  /**
   * @param userConditions
   * @param user
   */
  checkUserConditions(userConditions: IUserCondition[], user: User) {
    if (userConditions.length === 0) return true
    let result = true
    // const errorCondition = null
    for (const idx in userConditions) {
      const currentCondition = userConditions[idx]
      currentCondition.property = CommonService.convertSnakeToCamelStr(
        currentCondition.property,
      )

      const checkExistUserProperty = user[currentCondition.property]
      if (checkExistUserProperty === undefined) {
        // exist condition but data input not exist this property
        // errorCondition = currentCondition
        result = false
        break
      }

      if (
        currentCondition.type === 'number' &&
        !CommonService.compareNumberCondition(
          currentCondition.value,
          user[currentCondition.property],
          currentCondition.operator,
        )
      ) {
        // compare number fail
        // errorCondition = currentCondition
        result = false
        break
      }

      if (
        currentCondition.type === 'string' &&
        !eval(`'${user[currentCondition.property]}'
                ${currentCondition.operator}
                '${currentCondition.value}'`)
      ) {
        // compare string fail
        // errorCondition = currentCondition
        result = false
        break
      }

      if (
        currentCondition.type === 'boolean' &&
        !eval(`${user[currentCondition.property]}
                ${currentCondition.operator}
                ${currentCondition.value}`)
      ) {
        result = false
        break
      }
    }

    return result
  }

  async filterRunningMissions(ids: number[]) {
    const qb = this.missionRepository.createQueryBuilder('mission')
    qb.select('mission.id as id')
    qb.innerJoin(
      'campaigns',
      'campaigns',
      `campaigns.id = mission.campaign_id AND
        campaigns.is_active = ${CAMPAIGN_IS_ACTIVE.ACTIVE} AND
        campaigns.status = ${CAMPAIGN_STATUS.RUNNING}`,
    )
    qb.where('mission.status = :status', { status: MISSION_STATUS.RUNNING })
    qb.andWhere('mission.is_active = :active', {
      active: MISSION_IS_ACTIVE.ACTIVE,
    })
    qb.andWhereInIds(ids)
    return qb.getRawMany()
  }

  async updateMissionCheckin(campaign: Campaign) {
    return await this.missionRepository
      .createQueryBuilder()
      .update(Mission)
      .set({
        openingDate: campaign.startDate,
        closingDate: campaign.endDate,
        displayConditions: null,
      })
      .where({
        campaignId: campaign.id,
      })
      .execute()
  }

  async getPreviousOrderMission(
    campaignId: number,
    priority: number,
    userId: string,
  ) {
    const missions = await this.missionRepository
      .createQueryBuilder('mission')
      .leftJoin(
        'mission_user',
        'mission_user',
        `mission.id = mission_user.mission_id AND mission_user.user_id = ${userId}`,
      )
      .select('mission.*')
      .addSelect('SUM(success_count) as success_number')
      .where({
        campaignId,
      })
      .andWhere({
        status: In([MISSION_STATUS.OUT_OF_BUDGET, MISSION_STATUS.RUNNING]),
      })
      .andWhere('mission.is_active = :active', {
        active: MISSION_IS_ACTIVE.ACTIVE,
      })
      .andWhere('priority > :priority', { priority })
      .groupBy('mission.id')
      .getRawMany()

    return plainToInstance(MissionWithSuccessCount, missions)
  }

  async getListCheckinMission(userId: string, campaignId: number) {
    const qb = this.missionRepository.createQueryBuilder('mission')
    qb.select([
      'mission_user.success_count AS successCount',
      'mission.title AS title',
      'mission.titleJa AS titleJa',
      'mission.id AS id',
      'mission.priority AS priority',
      'mission.isActive as isActive',
      'mission.detailExplain AS detailExplain',
      'mission.detailExplainJa AS detailExplainJa',
      'mission.openingDate AS openingDate',
      'mission.closingDate AS closingDate',
      'mission.guideLink AS guideLink',
      'mission.guideLinkJa AS guideLinkJa',
      'mission.grantTarget AS grantTarget',
      'mission.campaignId AS campaignId',
      'mission.status AS status',
      'IF (success_count > 0, true, false) AS completed',
    ])
    qb.leftJoin(
      'mission_user',
      'mission_user',
      'mission_user.mission_id = mission.id AND mission_user.user_id = ' +
        userId +
        ' AND mission_user.user_type = "' +
        GRANT_TARGET_USER.USER +
        '"',
    )
    qb.where({
      status: In([MISSION_STATUS.OUT_OF_BUDGET, MISSION_STATUS.RUNNING]),
    })
    qb.andWhere({ campaignId })
    qb.andWhere('mission.is_active = :active', {
      active: MISSION_IS_ACTIVE.ACTIVE,
    })
    qb.orderBy('priority', 'DESC')

    return await qb.getRawMany()
  }
}
