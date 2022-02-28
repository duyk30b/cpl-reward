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

  async camelPaginate(
    options: IPaginationOptions,
    queryBuilder: SelectQueryBuilder<Campaign> = null,
  ): Promise<Pagination<Campaign>> {
    if (queryBuilder === null) queryBuilder = this.queryBuilder()
    return paginate<Campaign>(queryBuilder, options)
  }

  async snakePaginate(
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
