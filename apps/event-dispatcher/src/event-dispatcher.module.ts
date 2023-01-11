import { KafkaConsumerModule } from '@libs/kafka-libs/kafka-consumer.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GlobalConfig } from 'config/global.config'
import { AuthConsumerModule } from './auth-consumer/auth-consumer.module'
import { BceConsumerModule } from './bce-consumer/bce-consumer.module'
import { ExchangeConsumerModule } from './exchange-consumer/exchange-consumer.module'
import { HealthModule } from './health/health.module'
import { HighLowConsumerModule } from './high-low-consumer/high-low-consumer.module'
import { RewardConsumerModule } from './reward-consumer/reward-consumer.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [GlobalConfig],
    }),
    KafkaConsumerModule,
    HealthModule,
    AuthConsumerModule,
    BceConsumerModule,
    ExchangeConsumerModule,
    HighLowConsumerModule,
    RewardConsumerModule,
  ],
  controllers: [],
  providers: [],
})
export class EventDispatcherModule {}
