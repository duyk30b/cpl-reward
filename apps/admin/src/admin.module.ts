import { Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { MysqlModule } from '@lib/mysql'
import { AdminCampaignModule } from './admin-campaign/admin-campaign.module'
import { AdminMissionModule } from './admin-mission/admin-mission.module'
import { AdminCommonModule } from './admin-common/admin-common.module'
import { AdminRewardRuleModule } from './admin-reward-rule/admin-reward-rule.module'

@Module({
  imports: [
    MysqlModule,
    AdminCampaignModule,
    AdminMissionModule,
    AdminCommonModule,
    AdminRewardRuleModule,
  ],
  controllers: [AdminController],
})
export class AdminModule {}
