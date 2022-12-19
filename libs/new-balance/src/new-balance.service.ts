import { EventEmitterType } from '@lib/common'
import { Injectable, Logger } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  BalanceType,
  TransactionType,
} from './grpc-services/transaction/transaction.enum'
import { TransactionService } from './grpc-services/transaction/transaction.service'

@Injectable()
export class NewBalanceService {
  private readonly logger = new Logger(NewBalanceService.name)

  constructor(
    private eventEmitter: EventEmitter2,
    private transactionService: TransactionService,
  ) {}

  async sendReward(
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
      items: [
        {
          balanceType: balance,
          transactionType: TransactionType.REWARD,
          currency: transformedCurrency,
          amount: amount,
          transactionReferenceId: referenceId,
          alternatives: [],
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
        params: { type: BalanceType[balance] },
      })

      return {
        result: false,
        message: e,
      }
    }
  }
}
