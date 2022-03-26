import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { KafkaDecoratorProcessorService } from '@lib/kafka/kafka-decorator-processor.service'
import configuration from './configuration'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [KafkaDecoratorProcessorService],
})
export class KafkaModule {}
