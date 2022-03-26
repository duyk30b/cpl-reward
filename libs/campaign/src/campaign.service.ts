import { Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { Pagination, paginate } from 'nestjs-typeorm-paginate'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Campaign } from '@lib/campaign/entities/campaign.entity'
import { UpdateCampaignDto } from '@lib/campaign/dto/update-campaign.dto'
import { CreateCampaignDto } from '@lib/campaign/dto/create-campaign.dto'
import { CustomPaginationMetaTransformer } from '@lib/common/transformers/custom-pagination-meta.transformer'
import { IPaginationOptions } from 'nestjs-typeorm-paginate/dist/interfaces'
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder'

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
  ) {}

  async delete(id: number) {
    return await this.campaignRepository.delete({ id })
  }

  async getById(campaignId: number, options = undefined) {
    return await this.campaignRepository.findOne(campaignId, options)
  }

  async update(updateCampaignDto: UpdateCampaignDto): Promise<Campaign> {
    const updateCampaign = plainToInstance(
      UpdateCampaignDto,
      updateCampaignDto,
      {
        ignoreDecorators: true,
        excludeExtraneousValues: true,
      },
    )
    const campaignEntity = plainToInstance(Campaign, updateCampaign, {
      ignoreDecorators: true,
    })
    return await this.campaignRepository.save(campaignEntity)
  }

  async create(createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    const createCampaign = plainToInstance(
      CreateCampaignDto,
      createCampaignDto,
      {
        ignoreDecorators: true,
        excludeExtraneousValues: true,
      },
    )
    const campaignEntity = plainToInstance(Campaign, createCampaign, {
      ignoreDecorators: true,
    })
    return await this.campaignRepository.save(campaignEntity)
  }

  initQueryBuilder(): SelectQueryBuilder<Campaign> {
    return this.campaignRepository.createQueryBuilder('campaign')
  }

  private queryBuilder(): SelectQueryBuilder<Campaign> {
    const queryBuilder = this.initQueryBuilder()
    return queryBuilder
      .orderBy('campaign.id', 'DESC')
      .leftJoinAndSelect(
        'campaign.rewardRules',
        'rewardRules',
        "rewardRules.type_rule = 'campaign'",
      )
  }

  async paginate(
    options: IPaginationOptions<CustomPaginationMetaTransformer>,
    queryBuilder: SelectQueryBuilder<Campaign> = null,
  ): Promise<Pagination<Campaign, CustomPaginationMetaTransformer>> {
    if (queryBuilder === null) queryBuilder = this.queryBuilder()
    return paginate<Campaign, CustomPaginationMetaTransformer>(
      queryBuilder,
      options,
    )
  }
}
