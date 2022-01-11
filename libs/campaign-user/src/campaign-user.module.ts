import { Module } from '@nestjs/common'
import { CampaignUserService } from './campaign-user.service'
import { MysqlModule } from '@app/mysql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Campaign } from '@app/campaign/entities/campaign.entity'

@Module({
  imports: [MysqlModule, TypeOrmModule.forFeature([Campaign])],
  providers: [CampaignUserService],
  exports: [CampaignUserService],
})
export class CampaignUserModule {}
