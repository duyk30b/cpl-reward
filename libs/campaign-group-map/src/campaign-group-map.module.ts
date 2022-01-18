import { Module } from '@nestjs/common'
import { CampaignGroupMapService } from './campaign-group-map.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CampaignGroupMap } from '@app/campaign-group/entities/campaign-group-map.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CampaignGroupMap])],
  providers: [CampaignGroupMapService],
  exports: [CampaignGroupMapService],
})
export class CampaignGroupMapModule {}
