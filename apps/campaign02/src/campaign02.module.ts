import { Module } from '@nestjs/common'
import {
  ClientKafka,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices'
import { ConfigModule } from '@nestjs/config'
import { Campaign02Controller } from './campaign02.controller'

@Module({
  controllers: [Campaign02Controller],
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
              groupId: 'campaign02',
            },
          },
        })
      },
    },
  ],
})
export class Campaign02Module {}
