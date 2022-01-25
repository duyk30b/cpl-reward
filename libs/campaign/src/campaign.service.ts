import { Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Campaign } from '@app/campaign/entities/campaign.entity'
import { UpdateCampaignDto } from '@app/campaign/dto/update-campaign.dto'
import { CreateCampaignDto } from '@app/campaign/dto/create-campaign.dto'
// TODO: remove below import
// import { CampaignGroupMap } from '@app/campaign/entities/campaign-map.entity'
// import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult'

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private campaignGroupRepository: Repository<Campaign>,
  ) {}

  async getById(campaignId: number) {
    return await this.campaignGroupRepository.findOne(campaignId)
  }

  async update(updateCampaignDto: UpdateCampaignDto): Promise<Campaign> {
    updateCampaignDto = plainToInstance(UpdateCampaignDto, updateCampaignDto, {
      excludeExtraneousValues: true,
    })

    const campaignEntity = plainToInstance(Campaign, updateCampaignDto, {
      ignoreDecorators: true,
    })
    return await this.campaignGroupRepository.save(campaignEntity)
  }

  async create(createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    createCampaignDto = plainToInstance(CreateCampaignDto, createCampaignDto, {
      excludeExtraneousValues: true,
    })
    const campaignEntity = plainToInstance(Campaign, createCampaignDto, {
      ignoreDecorators: true,
    })
    return await this.campaignGroupRepository.save(campaignEntity)
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Campaign>> {
    const queryBuilder = this.campaignGroupRepository.createQueryBuilder('c')
    queryBuilder.orderBy('c.id', 'DESC')

    return paginate<Campaign>(queryBuilder, options)
  }
}
