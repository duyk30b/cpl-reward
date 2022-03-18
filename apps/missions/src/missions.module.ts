import { Module } from '@nestjs/common'
import { KafkaModule } from '@lib/kafka'
import { CommonModule } from '@lib/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { MysqlModule } from '@lib/mysql'
import { MissionsController } from './missions.controller'
import { DemoModule } from './demo/demo.module'
import { ConfigModule } from '@nestjs/config'
import { ExternalUserModule } from '@lib/external-user'
import { CommonListener } from './listeners/common.listener'
import { ExternalBalanceModule } from '@lib/external-balance'
import { MissionUserLogModule } from '@lib/mission-user-log'
import { MissionUserModule } from '@lib/mission-user'
import { RewardRuleModule } from '@lib/reward-rule'
import { UserRewardHistoryModule } from '@lib/user-reward-history'
import { ExternalListener } from './listeners/external.listener'
import { MissionsService } from './missions.service'

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
    DemoModule,
    ConfigModule,
    ExternalUserModule,
    ExternalBalanceModule,
    MissionUserLogModule,
    MissionUserModule,
    RewardRuleModule,
    UserRewardHistoryModule,
  ],
  providers: [CommonListener, ExternalListener, MissionsService],
})
export class MissionsModule {}
