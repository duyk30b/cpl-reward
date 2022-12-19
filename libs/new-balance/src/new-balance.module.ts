import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { join } from 'path'
import { NewBalanceService } from './new-balance.service'
import { TransactionService } from './grpc-services/transaction/transaction.service'
import configuration from './configuration'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [
    NewBalanceService,
    {
      provide: 'NEW_BALANCE_GRPC',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url: configService.get('new_balance.grpc_url'),
            package: ['grpc.balance.transaction.v2'],
            protoPath: [
              join(
                process.cwd(),
                'libs/new-balance/src/proto/transaction.proto',
              ),
            ],
            channelOptions: {
              'grpc.service_config': JSON.stringify({
                loadBalancingConfig: [{ round_robin: {} }],
              }),
            },
          },
        })
      },
      inject: [ConfigService],
    },
    TransactionService,
  ],
  exports: [NewBalanceService],
})
export class NewBalanceModule {}
