import { EventEmitterType } from '@lib/common'
import {
  ChangeUserCashbackInput,
  WalletServiceInterface,
} from '@libs/wallet-gateway/wallet.service.interface'
import { Injectable, Logger } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  BalanceType,
  TransactionType,
} from './grpc-services/transaction/transaction.enum'
import { TransactionService } from './grpc-services/transaction/transaction.service'

@Injectable()
export class ExternalNewBalanceService implements WalletServiceInterface {
  private readonly logger = new Logger(ExternalNewBalanceService.name)

  constructor(
    private eventEmitter: EventEmitter2,
    private transactionService: TransactionService,
  ) {}

  async changeUserBalance(
    userId: string,
    amount: string,
    currency: string,
    type: string,
    referenceId: string,
    data: any,
  ): Promise<any> {
    return await this.changeBalance(
      userId,
      amount,
      currency,
      referenceId,
      BalanceType.EXCHANGE,
      data,
    )
  }

  async changeUserCashback(input: ChangeUserCashbackInput): Promise<any> {
    return await this.changeBalance(
      input.user_id,
      input.amount,
      input.currency,
      input.referenceId,
      BalanceType.CASHBACK,
      input.data,
    )
  }

  async changeBalance(
    userId: string,
    amount: string,
    currency: string,
    referenceId: string,
    balance: BalanceType,
    data: any,
  ): Promise<any> {
    const transformedCurrency = currency.toLowerCase()
    const requestData = {
      userId: userId,
      balanceType: balance,
      items: [
        {
          transactionType: TransactionType.REWARD,
          currency: transformedCurrency,
          amount: amount,
          transactionReferenceId: referenceId,
        },
      ],
    }
    try {
      const result = await this.transactionService.createTransaction(
        requestData,
      )

      this.eventEmitter.emit(EventEmitterType.WRITE_LOG, {
        logLevel: 'log',
        traceCode: 'm015',
        data,
        extraData: {
          request: requestData,
          result: JSON.stringify(result),
        },
        params: { type: BalanceType[balance] },
      })

      return {
        result: true,
        message: '',
      }
    } catch (e) {
      this.eventEmitter.emit(EventEmitterType.WRITE_LOG, {
        logLevel: 'error',
        traceCode: 'm018',
        data,
        extraData: {
          request: requestData,
          response: e,
        },
        params: { type: 'balance' },
      })

      return {
        result: false,
        message: e,
      }
    }
  }
}
