import { Injectable } from '@nestjs/common'
import { Mission } from '@app/mission/entities/mission.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
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

  async getById(id: number): Promise<Mission> {
    return await this.missionRepository.findOne(id)
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

  async create(createCampaignDto: CreateMissionDto): Promise<Mission> {
    createCampaignDto = plainToInstance(CreateMissionDto, createCampaignDto, {
      excludeExtraneousValues: true,
    })
    const campaignEntity = plainToInstance(Mission, createCampaignDto, {
      ignoreDecorators: true,
    })
    return await this.missionRepository.save(campaignEntity)
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Mission>> {
    const queryBuilder = this.missionRepository.createQueryBuilder('c')
    queryBuilder.orderBy('c.id', 'DESC')

    return paginate<Mission>(queryBuilder, options)
  }
}
