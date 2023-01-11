import { KafkaConsumerModule } from '@libs/kafka-libs/kafka-consumer.module'
import { KafkaValidationExeptionFilter } from '@libs/kafka-libs/kafka-exception.filter'
import { ValidationException } from '@libs/utils/exception-filters/validation-exception.filter'
import { ValidationError, ValidationPipe } from '@nestjs/common'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_PIPE } from '@nestjs/core'
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
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        validateCustomDecorators: true,
        validationError: { target: false, value: true },
        transform: true,
        transformOptions: {
          excludeExtraneousValues: true,
          exposeUnsetFields: false,
        },
        exceptionFactory: (errors: ValidationError[] = []) => {
          return new ValidationException(errors)
        },
      }),
    },
    {
      provide: APP_FILTER,
      useClass: KafkaValidationExeptionFilter,
    },
  ],
})
export class EventDispatcherModule {}
