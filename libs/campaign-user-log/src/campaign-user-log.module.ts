import { Module } from '@nestjs/common'
import { CampaignUserLogService } from './campaign-user-log.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CampaignUserLog } from '@app/campaign-user-log/entities/campaign-user-log.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CampaignUserLog])],
  providers: [CampaignUserLogService],
  exports: [CampaignUserLogService],
})
export class CampaignUserLogModule {}
