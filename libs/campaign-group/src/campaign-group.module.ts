import { Module } from '@nestjs/common'
import { CampaignGroupService } from './campaign-group.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CampaignGroup } from '@app/campaign-group/entities/campaign-group.entity'
import { CampaignGroupMap } from '@app/campaign-group/entities/campaign-group-map.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CampaignGroup])],
  providers: [CampaignGroupService],
  exports: [CampaignGroupService],
})
export class CampaignGroupModule {}
