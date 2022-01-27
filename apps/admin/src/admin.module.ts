import { Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'
import { MysqlModule } from '@app/mysql'
import { AdminCampaignModule } from './admin-campaign/admin-campaign.module'
import { AdminMissionModule } from './admin-mission/admin-mission.module'

@Module({
  imports: [MysqlModule, AdminCampaignModule, AdminMissionModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
