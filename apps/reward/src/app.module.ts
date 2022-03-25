import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ApiMissionModule } from './api-mission/api-mission.module'
import { MysqlModule } from '@lib/mysql'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ApiCampaignModule } from './api-campaign/api-campaign.module'
import { ValidateAuthMiddleware } from './middlewares/validate-auth.middleware'
import { ApiCampaignController } from './api-campaign/api-campaign.controller'
import { ExternalUserModule } from '@lib/external-user'
import { ApiMissionController } from './api-mission/api-mission.controller'
import { ExternalBoModule } from '@lib/external-bo'
import { ConfigModule } from '@nestjs/config'
import configuration from '@lib/common/configuration'

@Module({
  imports: [
    MysqlModule,
    ApiMissionModule,
    ApiCampaignModule,
    ExternalUserModule,
    ExternalBoModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
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
