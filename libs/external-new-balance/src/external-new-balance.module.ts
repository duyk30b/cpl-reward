import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { join } from 'path'
import { ExternalNewBalanceService } from './external-new-balance.service'
import { TransactionService } from './grpc-services/transaction/transaction.service'
import configuration from './configuration'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [
    ExternalNewBalanceService,
    {
      provide: 'NEW_BALANCE_GRPC',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url: configService.get('new_balance.grpc_url'),
            package: ['grpc.balance.transaction.v1'],
            protoPath: [
              join(
                process.cwd(),
                'libs/external-new-balance/src/proto/transaction.proto',
              ),
            ],
          },
        })
      },
      inject: [ConfigService],
    },
    TransactionService,
  ],
  exports: [ExternalNewBalanceService],
})
export class ExternalNewBalanceModule {}
