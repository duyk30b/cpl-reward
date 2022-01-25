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
import { AdminUpdateMissionDto } from '@app/mission/dto/admin-update-mission.dto'

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(Mission)
    private campaignRepository: Repository<Mission>,
  ) {}

  async getById(campaignId: number): Promise<Mission> {
    return await this.campaignRepository.findOne(campaignId)
  }

  async getByIds(campaignIds: number[]): Promise<Mission[]> {
    return await this.campaignRepository.find({ id: In(campaignIds) })
  }

  async updateStats(campaignId: number, addMoney, addReward) {
    const campaign = await this.getById(campaignId)
    if (!campaign) {
      return null
    }

    campaign.releasedMoney += addMoney
    campaign.releasedReward += addReward

    return await this.campaignRepository.save(campaign)
  }

  async update(updateCampaignDto: AdminUpdateMissionDto): Promise<Mission> {
    updateCampaignDto = plainToInstance(
      AdminUpdateMissionDto,
      updateCampaignDto,
      {
        excludeExtraneousValues: true,
      },
    )

    const campaignEntity = plainToInstance(Mission, updateCampaignDto, {
      ignoreDecorators: true,
    })
    return await this.campaignRepository.save(campaignEntity)
  }

  async create(createCampaignDto: CreateMissionDto): Promise<Mission> {
    createCampaignDto = plainToInstance(CreateMissionDto, createCampaignDto, {
      excludeExtraneousValues: true,
    })
    const campaignEntity = plainToInstance(Mission, createCampaignDto, {
      ignoreDecorators: true,
    })
    return await this.campaignRepository.save(campaignEntity)
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Mission>> {
    const queryBuilder = this.campaignRepository.createQueryBuilder('c')
    queryBuilder.orderBy('c.id', 'DESC')

    return paginate<Mission>(queryBuilder, options)
  }
}
