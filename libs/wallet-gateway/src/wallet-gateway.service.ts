import { ExternalBalanceService } from '@lib/external-balance'
import { ExternalCashbackService } from '@lib/external-cashback'
import { ExternalNewBalanceService } from '@libs/external-new-balance'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  ChangeUserCashbackInput,
  WalletServiceInterface,
} from '@libs/wallet-gateway/wallet.service.interface'
import { WALLET_VERSION } from './wallet.enum'

@Injectable()
export class WalletGatewayService {
  private balanceWalletService: WalletServiceInterface
  private cashbackWalletService: WalletServiceInterface

  constructor(
    private configService: ConfigService,
    private externalBalanceService: ExternalBalanceService,
    private externalCashbackService: ExternalCashbackService,
    private externalNewBalanceService: ExternalNewBalanceService,
  ) {}

  onModuleInit() {
    const walletVersion = this.configService.get('common.wallet_version')

    switch (walletVersion) {
      case WALLET_VERSION.FIRST_VERSION:
        this.balanceWalletService = this.externalBalanceService
        this.cashbackWalletService = this.externalCashbackService
        break
      case WALLET_VERSION.SECOND_VERSION:
        this.balanceWalletService = this.externalNewBalanceService
        this.cashbackWalletService = this.externalNewBalanceService
        break
      default:
        this.balanceWalletService = this.externalBalanceService
        this.cashbackWalletService = this.externalCashbackService
        break
    }
  }

  async sendRewardToBalance(
    userId: string,
    amount: string,
    currency: string,
    type: string,
    referenceId: string,
    data: any,
  ) {
    return await this.balanceWalletService.changeUserBalance(
      userId,
      amount,
      currency,
      type,
      referenceId,
      data,
    )
  }

  async sendRewardToCashback(input: ChangeUserCashbackInput) {
    return await this.cashbackWalletService.changeUserCashback(input)
  }
}
