import { Module, ValidationError, ValidationPipe } from '@nestjs/common'
import { KafkaModule } from '@lib/kafka'
import { CommonModule } from '@lib/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { MysqlModule } from '@lib/mysql'
import { WorkerController } from './worker.controller'
import { ConfigModule } from '@nestjs/config'
import { ExternalUserModule } from '@lib/external-user'
import { CommonListener } from './listeners/common.listener'
import { MissionUserLogModule } from '@lib/mission-user-log'
import { RewardRuleModule } from '@lib/reward-rule'
import { UserRewardHistoryModule } from '@lib/user-reward-history'
import { WorkerService } from './worker.service'
import { MissionUserModule } from '@lib/mission-user'
import { MissionEventModule } from '@lib/mission-event'
import { CampaignModule } from '@lib/campaign'
import { MissionModule } from '@lib/mission'
import { TraceListener } from './listeners/trace.listener'
import { MissionsListener } from './listeners/missions.listener'
import globalConfig from 'config/global_config'
import { ScheduleModule } from '@nestjs/schedule'
import { HealthService } from './health.service'
import { TerminusModule } from '@nestjs/terminus'
import { IdGeneratorModule } from '@lib/id-generator'
import { MissionsProcessor } from './missions.processor'
import { RedisModule } from '@lib/redis'
import { QueueModule } from '@lib/queue/queue.module'
import { BankerBalanceProcessor } from './banker-balance.processor'
import { BankerCashbackProcessor } from './banker-cashback.processor'
import { TaggingListener } from './listeners/tagging.listener'
import { WalletGatewayModule } from '@libs/wallet-gateway'
import { APP_PIPE } from '@nestjs/core'
import { ValidationException } from '@lib/common/exceptions/validation.exception'
import { EventHandlerProcessor } from './event-handler.processor'
import { NewBalanceModule } from '@libs/new-balance'
import { SendRewardProcessor } from './send-reward.processor'

@Module({
  controllers: [WorkerController],
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [globalConfig],
    }),
    TerminusModule,
    MysqlModule,
    QueueModule,
    CommonModule,
    KafkaModule,
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '_',
    }),
    ExternalUserModule,
    MissionUserLogModule,
    RewardRuleModule,
    UserRewardHistoryModule,
    MissionUserModule,
    MissionEventModule,
    CampaignModule,
    MissionModule,
    IdGeneratorModule,
    RedisModule,
    WalletGatewayModule,
    NewBalanceModule,
  ],
  providers: [
    CommonListener,
    WorkerService,
    MissionsListener,
    TraceListener,
    TaggingListener,
    HealthService,
    MissionsProcessor,
    BankerBalanceProcessor,
    EventHandlerProcessor,
    BankerCashbackProcessor,
    SendRewardProcessor,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        validateCustomDecorators: true,
        transform: true,
        validationError: {
          target: false,
          value: false,
        },
        transformOptions: {
          excludeExtraneousValues: true,
        },
        exceptionFactory: (validationErrors: ValidationError[] = []) => {
          return new ValidationException(validationErrors)
        },
      }),
    },
  ],
})
export class WorkerModule {}
