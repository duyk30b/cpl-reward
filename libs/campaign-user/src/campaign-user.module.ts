import { Module } from '@nestjs/common'
import { CampaignUserService } from './campaign-user.service'
import { MysqlModule } from '@app/mysql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CampaignEntity } from '@app/campaign/entities/campaign.entity'

@Module({
  imports: [MysqlModule, TypeOrmModule.forFeature([CampaignEntity])],
  providers: [CampaignUserService],
  exports: [CampaignUserService],
})
export class CampaignUserModule {}
