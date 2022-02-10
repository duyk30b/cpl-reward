import { Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Campaign } from '@app/campaign/entities/campaign.entity'
import { UpdateCampaignDto } from '@app/campaign/dto/update-campaign.dto'
import { CreateCampaignDto } from '@app/campaign/dto/create-campaign.dto'

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
  ) {}

  async init() {
    const initCampaignEntity = plainToInstance(Campaign, {
      title: 'Init Campaign',
    })
    return await this.campaignRepository.save(initCampaignEntity)
  }

  async delete(id: number) {
    return await this.campaignRepository.delete({ id })
  }

  async getById(campaignId: number, options = undefined) {
    return await this.campaignRepository.findOne(campaignId, options)
  }

  async update(updateCampaignDto: UpdateCampaignDto): Promise<Campaign> {
    const campaignEntity = plainToInstance(Campaign, updateCampaignDto, {
      ignoreDecorators: true,
    })
    return await this.campaignRepository.save(campaignEntity)
  }

  async create(createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    const campaignEntity = plainToInstance(Campaign, createCampaignDto, {
      ignoreDecorators: true,
    })
    return await this.campaignRepository.save(campaignEntity)
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Campaign>> {
    const queryBuilder = this.campaignRepository.createQueryBuilder('c')
    queryBuilder.orderBy('c.id', 'DESC')

    return paginate<Campaign>(queryBuilder, options)
  }
}
