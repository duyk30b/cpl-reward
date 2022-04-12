import { Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { MysqlModule } from '@lib/mysql'
import { AdminCampaignModule } from './admin-campaign/admin-campaign.module'
import { AdminMissionModule } from './admin-mission/admin-mission.module'
import { AdminCommonModule } from './admin-common/admin-common.module'
import { UserRewardHistoryModule } from '@lib/user-reward-history'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [
    MysqlModule,
    AdminCampaignModule,
    AdminMissionModule,
    AdminCommonModule,
    UserRewardHistoryModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AdminController],
})
export class AdminModule {}
