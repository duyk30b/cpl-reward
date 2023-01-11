import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { KafkaConfig } from './kafka.config'
import { KafkaConsumerService } from './kafka-consumer.service'

@Module({
  imports: [ConfigModule.forFeature(KafkaConfig)],
  providers: [KafkaConsumerService],
})
export class KafkaConsumerModule {}
