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
import { MongoModule } from '@lib/mongo'
import { MongooseModule } from '@nestjs/mongoose'
import { EventAuthSchema } from './schemas/event-auth.schema'
import { EventHighLowSchema } from './schemas/event-high-low.schema'
import { EventBceSchema } from './schemas/event-bce.schema'
import { TraceSaveListener } from './listeners/trace-save.listener'
import { MissionsListener } from './listeners/missions.listener'

const importDebugs = []
const providerDebug = []
if (JSON.parse(process.env.ENABLE_SAVE_LOG)) {
  importDebugs.push(MongoModule)
  importDebugs.push(
    MongooseModule.forFeature([
      { name: 'EventAuth', schema: EventAuthSchema },
      { name: 'EventHighLow', schema: EventHighLowSchema },
      { name: 'EventBce', schema: EventBceSchema },
    ]),
  )
  providerDebug.push(TraceSaveListener)
}
@Module({
  controllers: [MissionsController],
  imports: [
    MysqlModule,
    CommonModule,
    ...importDebugs,
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
    ...providerDebug,
  ],
})
export class MissionsModule {}
