import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { KafkaDecoratorProcessorService } from '@lib/kafka/kafka-decorator-processor.service'
import configuration from './configuration'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { KafkaService } from './kafka.service'
import { CommonModule } from '@lib/common'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    CommonModule,
  ],
  providers: [
    KafkaDecoratorProcessorService,
    {
      provide: 'KAFKA_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get<string>('kafka.client'),
              brokers: [configService.get<string>('kafka.uri')],
            },
            producer: {
              allowAutoTopicCreation: true,
            },
          },
        })
      },
      inject: [ConfigService],
    },
    KafkaService,
  ],
  exports: [KafkaService],
})
export class KafkaModule {}
