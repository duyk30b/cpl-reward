import { Injectable } from '@nestjs/common'
import { Campaign } from '@app/campaign/entities/campaign.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate'
import { CreateCampaignDto } from '@app/campaign/dto/create-campaign.dto'
import { plainToInstance } from 'class-transformer'
import { AdminUpdateCampaignDto } from '@app/campaign/dto/admin-update-campaign.dto'

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
  ) {}

  async getCampaignById(campaignId: number) {
    return await this.campaignRepository.findOne(campaignId)
  }

  async update(updateCampaignDto: AdminUpdateCampaignDto): Promise<Campaign> {
    updateCampaignDto = plainToInstance(
      AdminUpdateCampaignDto,
      updateCampaignDto,
      {
        excludeExtraneousValues: true,
      },
    )

    const campaignEntity = plainToInstance(Campaign, updateCampaignDto, {
      ignoreDecorators: true,
    })
    return await this.campaignRepository.save(campaignEntity)
  }

  async create(createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    createCampaignDto = plainToInstance(CreateCampaignDto, createCampaignDto, {
      excludeExtraneousValues: true,
    })
    const campaignEntity = plainToInstance(Campaign, createCampaignDto, {
      ignoreDecorators: true,
    })
    return await this.campaignRepository.save(campaignEntity)
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Campaign>> {
    return paginate<Campaign>(this.campaignRepository, options)
  }
}
