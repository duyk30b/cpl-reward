import { Module } from '@nestjs/common'
import { KafkaModule } from '@lib/kafka'
import { CommonModule } from '@lib/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { MysqlModule } from '@lib/mysql'
import { MissionsController } from './missions.controller'
import { ConfigModule } from '@nestjs/config'
import { ExternalUserModule } from '@lib/external-user'
import { CommonListener } from './listeners/common.listener'
import { ExternalBalanceModule } from '@lib/external-balance'
import { MissionUserLogModule } from '@lib/mission-user-log'
import { RewardRuleModule } from '@lib/reward-rule'
import { UserRewardHistoryModule } from '@lib/user-reward-history'
import { ExternalListener } from './listeners/external.listener'
import { MissionsService } from './missions.service'
import { MissionUserModule } from '@lib/mission-user'
import { MissionEventModule } from '@lib/mission-event'
import { CampaignModule } from '@lib/campaign'
import { MissionModule } from '@lib/mission'
import { ExternalCashbackModule } from '@lib/external-cashback'
import { TraceListener } from './listeners/trace.listener'
import { MissionsListener } from './listeners/missions.listener'
import { RedisQueueModule } from '@lib/redis-queue'
import global_config from 'config/global_config'
import { ScheduleModule } from '@nestjs/schedule'
import { HealthService } from './health.service'
import { TerminusModule } from '@nestjs/terminus'

@Module({
  controllers: [MissionsController],
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [global_config],
    }),
    TerminusModule,
    MysqlModule,
    RedisQueueModule,
    CommonModule,
    KafkaModule,
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '_',
    }),
    ExternalUserModule,
    ExternalBalanceModule,
    MissionUserLogModule,
    RewardRuleModule,
    UserRewardHistoryModule,
    MissionUserModule,
    ExternalCashbackModule,
    MissionEventModule,
    CampaignModule,
    MissionModule,
  ],
  providers: [
    CommonListener,
    ExternalListener,
    MissionsService,
    MissionsListener,
    TraceListener,
    HealthService,
  ],
})
export class MissionsModule {}
