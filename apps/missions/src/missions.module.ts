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
import { ExternalBoModule } from '@lib/external-bo'
import { MissionsListener } from './listeners/missions.listener'
import { MissionEventModule } from '@lib/mission-event'
import { CampaignModule } from '@lib/campaign'
import { MissionModule } from '@lib/mission'

@Module({
  controllers: [MissionsController],
  imports: [
    MysqlModule,
    CommonModule,
    KafkaModule,
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '_',
    }),
    ConfigModule,
    ExternalUserModule,
    ExternalBalanceModule,
    MissionUserLogModule,
    RewardRuleModule,
    UserRewardHistoryModule,
    MissionUserModule,
    ExternalBoModule,
    MissionEventModule,
    CampaignModule,
    MissionModule,
  ],
  providers: [
    CommonListener,
    ExternalListener,
    MissionsService,
    MissionsListener,
  ],
})
export class MissionsModule {}
