import { Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { Pagination, paginate, IPaginationMeta } from 'nestjs-typeorm-paginate'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Campaign } from '@app/campaign/entities/campaign.entity'
import { UpdateCampaignDto } from '@app/campaign/dto/update-campaign.dto'
import { CreateCampaignDto } from '@app/campaign/dto/create-campaign.dto'
import { CustomPaginationMetaTransformer } from '@app/common/transformers/custom-pagination-meta.transformer'

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

  async paginate(options: {
    metaTransformer: (meta: IPaginationMeta) => CustomPaginationMetaTransformer
    limit: number
    page: number
  }): Promise<Pagination<Campaign, CustomPaginationMetaTransformer>> {
    const queryBuilder = this.campaignRepository.createQueryBuilder('campaign')
    queryBuilder.orderBy('campaign.id', 'DESC')
    queryBuilder.leftJoinAndSelect(
      'campaign.rewardRules',
      'rewardRules',
      "rewardRules.type_rule = 'campaign'",
    )

    return paginate<Campaign, CustomPaginationMetaTransformer>(
      queryBuilder,
      options,
    )
  }
}
