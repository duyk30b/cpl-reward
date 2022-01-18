import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ApiCampaignModule } from './campaign/api-campaign.module'
import { MysqlModule } from '@app/mysql'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ApiCampaignGroupModule } from './campaign-group/api-campaign-group.module'

@Module({
  imports: [MysqlModule, ApiCampaignModule, ApiCampaignGroupModule],
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
