import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'
import { MysqlModule } from '@app/mysql'
import { AdminCampaignModule } from './admin-campaign/admin-campaign.module'
import { AdminMissionModule } from './admin-mission/admin-mission.module'
import { APP_INTERCEPTOR } from '@nestjs/core'

@Module({
  imports: [MysqlModule, AdminCampaignModule, AdminMissionModule],
  controllers: [AdminController],
  providers: [
    AdminService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AdminModule {}
