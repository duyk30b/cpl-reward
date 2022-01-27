import { Injectable } from '@nestjs/common'
import { Mission } from '@app/mission/entities/mission.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate'
import { CreateMissionDto } from '@app/mission/dto/create-mission.dto'
import { plainToInstance } from 'class-transformer'
import { UpdateMissionDto } from '@app/mission/dto/update-mission.dto'

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
  ) {}

  async getById(id: number, options = undefined): Promise<Mission> {
    return await this.missionRepository.findOne(id, options)
  }

  // async getByIds(campaignIds: number[]): Promise<Mission[]> {
  //   return await this.missionRepository.find({ id: In(campaignIds) })
  // }
  //
  // async updateStats(campaignId: number, addMoney, addReward) {
  //   const campaign = await this.getById(campaignId)
  //   if (!campaign) {
  //     return null
  //   }
  //
  //   campaign.releasedMoney += addMoney
  //   campaign.releasedReward += addReward
  //
  //   return await this.missionRepository.save(campaign)
  // }

  async update(updateMissionDto: UpdateMissionDto): Promise<Mission> {
    updateMissionDto = plainToInstance(UpdateMissionDto, updateMissionDto, {
      excludeExtraneousValues: true,
    })

    const missionEntity = plainToInstance(Mission, updateMissionDto, {
      ignoreDecorators: true,
    })

    return await this.missionRepository.save(missionEntity)
  }

  async create(createMissionDto: CreateMissionDto): Promise<Mission> {
    createMissionDto = plainToInstance(CreateMissionDto, createMissionDto, {
      excludeExtraneousValues: true,
    })

    const missionEntity = plainToInstance(Mission, createMissionDto, {
      ignoreDecorators: true,
    })

    return await this.missionRepository.save(missionEntity)
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Mission>> {
    const queryBuilder = this.missionRepository.createQueryBuilder('c')
    queryBuilder.orderBy('c.id', 'DESC')

    return paginate<Mission>(queryBuilder, options)
  }
}
