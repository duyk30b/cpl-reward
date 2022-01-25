import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ApiMissionModule } from './mission/api-mission.module'
import { MysqlModule } from '@app/mysql'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ApiCampaignModule } from './campaign/api-campaign.module'

@Module({
  imports: [MysqlModule, ApiMissionModule, ApiCampaignModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
