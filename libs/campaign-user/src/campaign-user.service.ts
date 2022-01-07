import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CampaignUserEntity } from '@app/campaign-user/entities/campaign-user.entity'
import { plainToInstance } from 'class-transformer'

@Injectable()
export class CampaignUserService {
  constructor(
    @InjectRepository(CampaignUserEntity)
    private campaignUserRepository: Repository<CampaignUserEntity>,
  ) {}

  async update(campaignId: number, userId: number, dataToUpdate: any) {
    return await this.campaignUserRepository.update(
      { campaignId: campaignId, userId: userId },
      plainToInstance(CampaignUserEntity, dataToUpdate, {
        ignoreDecorators: true,
      }),
    )
  }

  async save(campaignUser: CampaignUserEntity) {
    return await this.campaignUserRepository.save(campaignUser)
  }

  async getCampaignUser(campaignId: number, userId: number) {
    return await this.campaignUserRepository.findOne({
      campaignId: campaignId,
      userId: userId,
    })
  }
}
