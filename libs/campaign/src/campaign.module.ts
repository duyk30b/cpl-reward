import { Module } from '@nestjs/common'
import { CampaignService } from './campaign.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Campaign } from '@app/campaign/entities/campaign.entity'
// TODO: remove below import
// import { CampaignGroupMap } from '@app/campaign/entities/campaign-map.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Campaign])],
  providers: [CampaignService],
  exports: [CampaignService],
})
export class CampaignModule {}
