import { Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { CampaignGroup } from '@app/campaign-group/entities/campaign-group.entity'
import { UpdateCampaignGroupDto } from '@app/campaign-group/dto/update-campaign.dto'
import { CreateCampaignGroupDto } from '@app/campaign-group/dto/create-campaign-group.dto'
import { CampaignGroupMap } from '@app/campaign-group/entities/campaign-group-map.entity'
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult'

@Injectable()
export class CampaignGroupService {
  constructor(
    @InjectRepository(CampaignGroup)
    private campaignGroupRepository: Repository<CampaignGroup>,
  ) {}

  async getById(campaignId: number) {
    return await this.campaignGroupRepository.findOne(campaignId)
  }

  async update(
    updateCampaignGroupDto: UpdateCampaignGroupDto,
  ): Promise<CampaignGroup> {
    updateCampaignGroupDto = plainToInstance(
      UpdateCampaignGroupDto,
      updateCampaignGroupDto,
      {
        excludeExtraneousValues: true,
      },
    )

    const campaignEntity = plainToInstance(
      CampaignGroup,
      updateCampaignGroupDto,
      {
        ignoreDecorators: true,
      },
    )
    return await this.campaignGroupRepository.save(campaignEntity)
  }

  async create(
    createCampaignGroupDto: CreateCampaignGroupDto,
  ): Promise<CampaignGroup> {
    createCampaignGroupDto = plainToInstance(
      CreateCampaignGroupDto,
      createCampaignGroupDto,
      {
        excludeExtraneousValues: true,
      },
    )
    const campaignEntity = plainToInstance(
      CampaignGroup,
      createCampaignGroupDto,
      {
        ignoreDecorators: true,
      },
    )
    return await this.campaignGroupRepository.save(campaignEntity)
  }

  async paginate(
    options: IPaginationOptions,
  ): Promise<Pagination<CampaignGroup>> {
    const queryBuilder = this.campaignGroupRepository.createQueryBuilder('c')
    queryBuilder.orderBy('c.id', 'DESC')

    return paginate<CampaignGroup>(queryBuilder, options)
  }
}
