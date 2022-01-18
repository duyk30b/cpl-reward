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

@Injectable()
export class CampaignGroupService {
  constructor(
    @InjectRepository(CampaignGroup)
    private campaignGroupRepository: Repository<CampaignGroup>,
    @InjectRepository(CampaignGroupMap)
    private campaignGroupMapRepository: Repository<CampaignGroupMap>,
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

  async mapCampaigns(groupId: number, campaignIds: []) {
    const existingMaps = await this.campaignGroupMapRepository.find({
      where: { groupId: groupId, campaignId: In(campaignIds) },
    })

    const existingMapIds = existingMaps.map((existingMap) => {
      return existingMap.campaignId
    })

    const missingCampaignIds = campaignIds.filter(
      (x) => !existingMapIds.includes(x),
    )

    const missingCampaigns = missingCampaignIds.map((id) => {
      const newMap = new CampaignGroupMap()
      newMap.groupId = groupId
      newMap.campaignId = id
      return newMap
    })

    return await this.campaignGroupMapRepository.save(missingCampaigns)
  }

  async unmapCampaigns(groupId: number, campaignIds: []) {
    return await this.campaignGroupMapRepository.delete({
      groupId: groupId,
      campaignId: In(campaignIds),
    })
  }

  async getMapsByGroupId(groupId: number) {
    return await this.campaignGroupMapRepository.find({ groupId: groupId })
  }
}
