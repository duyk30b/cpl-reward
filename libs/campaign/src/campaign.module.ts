import { Module } from '@nestjs/common'
import { CampaignService } from './campaign.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Campaign } from '@lib/campaign/entities/campaign.entity'
import { ConfigModule } from '@nestjs/config'
import campaignConfig from './configuration'

@Module({
  imports: [
    TypeOrmModule.forFeature([Campaign]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [campaignConfig],
    }),
  ],
  providers: [CampaignService],
  exports: [CampaignService],
})
export class CampaignModule {}
