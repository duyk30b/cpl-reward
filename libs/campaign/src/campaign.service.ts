import { Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { Pagination, paginate, paginateRaw } from 'nestjs-typeorm-paginate'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, UpdateResult } from 'typeorm'
import { Campaign } from '@lib/campaign/entities/campaign.entity'
import { UpdateCampaignDto } from '@lib/campaign/dto/update-campaign.dto'
import { CreateCampaignDto } from '@lib/campaign/dto/create-campaign.dto'
import { CustomPaginationMetaTransformer } from '@lib/common/transformers/custom-pagination-meta.transformer'
import { IPaginationOptions } from 'nestjs-typeorm-paginate/dist/interfaces'
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder'
import {
  CAMPAIGN_IS_ACTIVE,
  CAMPAIGN_TYPE,
  CAMPAIGN_STATUS,
} from '@lib/campaign/enum'

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
  ) {}

  async delete(id: number) {
    return await this.campaignRepository.delete({ id })
  }

  async getRunningCampaignById(campaignId: number): Promise<Campaign> {
    const campaign = await this.findOne({
      id: campaignId,
      isActive: CAMPAIGN_IS_ACTIVE.ACTIVE,
      // type: CAMPAIGN_TYPE.DEFAULT,
      status: CAMPAIGN_STATUS.RUNNING,
    })
    if (!campaign) return null
    return campaign
  }

  async getById(campaignId: number, options = undefined) {
    return await this.campaignRepository.findOne(campaignId, options)
  }

  async findOne(conditions, options = undefined) {
    return await this.campaignRepository.findOne(conditions, options)
  }

  async update(updateCampaignDto: UpdateCampaignDto): Promise<UpdateResult> {
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

    const queryBuilder = this.campaignRepository
      .createQueryBuilder('campaign')
      .update({ ...campaignEntity })
      .where({ id: campaignEntity.id })

    if (
      campaignEntity.isActive === CAMPAIGN_IS_ACTIVE.ACTIVE &&
      campaignEntity.type === CAMPAIGN_TYPE.ORDER
    ) {
      queryBuilder.andWhere(
        '(SELECT count(*) FROM campaigns where id != :id AND is_active = :active AND type = :type) = 0',
        {
          id: campaignEntity.id,
          type: CAMPAIGN_TYPE.ORDER,
          active: CAMPAIGN_IS_ACTIVE.ACTIVE,
        },
      )
    }

    return await queryBuilder.execute()
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

  async updateStatus(criteria: any, status: number) {
    await this.campaignRepository.update(criteria, {
      status,
    })
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

  async getPaginate(
    options: IPaginationOptions<CustomPaginationMetaTransformer>,
    queryBuilder: SelectQueryBuilder<Campaign> = null,
    isRaw = false,
  ): Promise<Pagination<Campaign, CustomPaginationMetaTransformer>> {
    if (queryBuilder === null) queryBuilder = this.queryBuilder()
    if (isRaw) {
      return paginateRaw(queryBuilder, options)
    }
    return paginate<Campaign, CustomPaginationMetaTransformer>(
      queryBuilder,
      options,
    )
  }
}
