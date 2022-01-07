import { Module } from '@nestjs/common'
import { CampaignUserLogService } from './campaign-user-log.service'

@Module({
  providers: [CampaignUserLogService],
  exports: [CampaignUserLogService],
})
export class CampaignUserLogModule {}
