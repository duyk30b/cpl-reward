import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ApiCampaignModule } from './campaign/api-campaign.module'
import { MysqlModule } from '@app/mysql'
import { APP_INTERCEPTOR } from '@nestjs/core'

@Module({
  imports: [MysqlModule, ApiCampaignModule],
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
