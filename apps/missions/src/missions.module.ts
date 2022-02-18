import { Module } from '@nestjs/common'
import { KafkaModule } from '@app/kafka'
import { CommonModule } from '@app/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { MysqlModule } from '@app/mysql'
import { MissionsController } from './missions.controller'
import { DemoModule } from './demo/demo.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { join } from 'path'

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
  ],
  providers: [
    {
      provide: 'USER_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url: 'localhost:58948',
            package: ['user'],
            protoPath: join(__dirname, 'demo/user.proto'),
          },
        })
      },
      inject: [ConfigService],
    },
  ],
})
export class MissionsModule {}
