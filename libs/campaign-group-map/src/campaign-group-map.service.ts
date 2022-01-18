import { Injectable } from '@nestjs/common'
import { In, Repository } from 'typeorm'
import { CampaignGroupMap } from '@app/campaign-group/entities/campaign-group-map.entity'
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class CampaignGroupMapService {
  constructor(
    @InjectRepository(CampaignGroupMap)
    private campaignGroupMapRepository: Repository<CampaignGroupMap>,
  ) {}

  async mapCampaigns(groupId: number, campaignIds: number[]) {
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

  async unmapCampaigns(
    groupId: number,
    campaignIds: number[],
  ): Promise<DeleteResult> {
    return await this.campaignGroupMapRepository.delete({
      groupId: groupId,
      campaignId: In(campaignIds),
    })
  }

  async getMapsByGroupId(groupId: number): Promise<CampaignGroupMap[]> {
    return await this.campaignGroupMapRepository.find({ groupId: groupId })
  }
}
