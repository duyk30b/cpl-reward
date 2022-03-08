import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ApiMissionModule } from './mission/api-mission.module'
import { MysqlModule } from '@lib/mysql'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ApiCampaignModule } from './campaign/api-campaign.module'
import { ValidateAuthMiddleware } from './middlewares/validate-auth.middleware'
import { ApiCampaignController } from './campaign/api-campaign.controller'
import { ExternalUserModule } from '@lib/external-user'
import { ApiMissionController } from './mission/api-mission.controller'

@Module({
  imports: [
    MysqlModule,
    ApiMissionModule,
    ApiCampaignModule,
    ExternalUserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateAuthMiddleware).forRoutes(ApiCampaignController)
    consumer.apply(ValidateAuthMiddleware).forRoutes(ApiMissionController)
  }
}
