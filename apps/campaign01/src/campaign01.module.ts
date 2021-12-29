import { Module } from '@nestjs/common'
import {
  ClientKafka,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices'
import { ConfigModule } from '@nestjs/config'
import { Campaign01Controller } from './campaign01.controller'

@Module({
  controllers: [Campaign01Controller],
  imports: [ConfigModule],
  providers: [
    ClientKafka,
    {
      provide: 'KAFKA_SERVICE',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: ['localhost:29092'],
            },
            consumer: {
              groupId: 'campaign01',
            },
          },
        })
      },
    },
  ],
})
export class Campaign01Module {}
