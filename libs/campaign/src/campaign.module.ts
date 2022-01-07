import { Module } from '@nestjs/common'
import { CampaignService } from './campaign.service'
import { MysqlModule } from '@app/mysql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CampaignEntity } from '@app/campaign/entities/campaign.entity'

@Module({
  imports: [MysqlModule, TypeOrmModule.forFeature([CampaignEntity])],
  providers: [CampaignService],
  exports: [CampaignService],
})
export class CampaignModule {}
