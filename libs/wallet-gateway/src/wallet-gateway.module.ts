import { ExternalBalanceModule } from '@lib/external-balance'
import { ExternalCashbackModule } from '@lib/external-cashback'
import { ExternalNewBalanceModule } from '@libs/external-new-balance'
import { Module } from '@nestjs/common'
import { WalletGatewayService } from './wallet-gateway.service'

@Module({
  imports: [
    ExternalBalanceModule,
    ExternalCashbackModule,
    ExternalNewBalanceModule,
  ],
  providers: [WalletGatewayService],
  exports: [WalletGatewayService],
})
export class WalletGatewayModule {}
