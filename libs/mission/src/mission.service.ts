import { Injectable } from '@nestjs/common'
import { Mission } from '@lib/mission/entities/mission.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
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
  WALLET,
} from '@lib/mission/enum'
import {
  IUser,
  IUserCondition,
} from '../../../apps/missions/src/interfaces/missions.interface'
import { CommonService } from '@lib/common'

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
  checkUserConditions(userConditions: IUserCondition[], user: IUser) {
    if (userConditions.length === 0) return true
    let result = true
    let errorCondition = null
    for (const idx in userConditions) {
      const currentCondition = userConditions[idx]
      currentCondition.property = CommonService.convertSnakeToCamelStr(
        currentCondition.property,
      )

      const checkExistUserProperty = user[currentCondition.property]
      if (checkExistUserProperty === undefined) {
        // exist condition but data input not exist this property
        errorCondition = currentCondition
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
        errorCondition = currentCondition
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
        errorCondition = currentCondition
        result = false
        break
      }

      if (
        currentCondition.type === 'boolean' &&
        !eval(`${user[currentCondition.property]}
                ${currentCondition.operator}
                ${currentCondition.value}`)
      ) {
        // compare boolean and other fail
        errorCondition = currentCondition
        result = false
        break
      }
    }

    return result
  }
}
