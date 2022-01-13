import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CampaignUser } from '@app/campaign-user/entities/campaign-user.entity'
import { plainToInstance } from 'class-transformer'

@Injectable()
export class CampaignUserService {
  constructor(
    @InjectRepository(CampaignUser)
    private campaignUserRepository: Repository<CampaignUser>,
  ) {}

  async update(campaignId: number, userId: number, dataToUpdate: any) {
    return await this.campaignUserRepository.update(
      { campaignId: campaignId, userId: userId },
      plainToInstance(CampaignUser, dataToUpdate, {
        ignoreDecorators: true,
      }),
    )
  }

  async save(campaignUser: CampaignUser) {
    return await this.campaignUserRepository.save(campaignUser)
  }

  async getCampaignUser(campaignId: number, userId: number) {
    return await this.campaignUserRepository.findOne({
      campaignId: campaignId,
      userId: userId,
    })
  }
}
