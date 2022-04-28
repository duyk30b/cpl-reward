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
import { ConfigModule } from '@nestjs/config'
import configuration from '@lib/common/configuration'
import { HealthModule } from './health/health.module'
// import { EventEmitterModule } from '@nestjs/event-emitter'
// import { TraceListener } from '../../missions/src/listeners/trace.listener'
// import { RedisQueueModule } from '@lib/redis-queue'
// import { CommonModule } from '@lib/common'
// import { ExternalBalanceModule } from '@lib/external-balance'
// import { ExternalCashbackModule } from '@lib/external-cashback'

@Module({
  imports: [
    MysqlModule,
    ApiMissionModule,
    ApiCampaignModule,
    ExternalUserModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
    HealthModule,
    // test
    // EventEmitterModule.forRoot({
    //   wildcard: true,
    //   delimiter: '_',
    // }),
    // RedisQueueModule,
    // CommonModule,
    // ExternalCashbackModule,
    // ExternalBalanceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    // test
    // TraceListener,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateAuthMiddleware).forRoutes(ApiCampaignController)
    consumer.apply(ValidateAuthMiddleware).forRoutes(ApiMissionController)
  }
}
