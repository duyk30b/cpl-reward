import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { ChangeUserCashback } from './external-cashback.interface'
import { firstValueFrom, map } from 'rxjs'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class ExternalCashbackService {
  eventEmit = 'write_log'
  private readonly logger = new Logger(ExternalCashbackService.name)

  constructor(
    private eventEmitter: EventEmitter2,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  /**
   * Example Input:
   * user_id: 41449,
   * balance_type: 'CASHBACK',
   * transaction_type: MANUALLY,
   * reference_id: '',
   * currency: 'USDT',
   * amount: '12.004',
   * fee_currency: '0',
   * fee_balance_type: 'CASHBACK',
   * fee_transaction_type: 'MANUALLY',
   * fee_amount: '0',
   * auto_confirm: 1
   */
  async changeUserCashback(input: ChangeUserCashback): Promise<any> {
    const postBoUrl =
      this.configService
        .get('cashback.url')
        .replace('service-api', 'service-internal') + '/transaction/create'

    const postData = {
      ...input,
      balance_type: 'CASHBACK',
      transaction_type: 'REWARD',
      reference_id: `${input.historyId}`,
      fee_currency: '0',
      fee_balance_type: 'CASHBACK',
      fee_transaction_type: 'MANUALLY',
      fee_amount: '0',
      auto_confirm: 1,
    }
    try {
      /**
       * Structure Result
       * {
       *   user_id: xxxxx,
       *   reference_id: 'xxxxx',
       *   update_time: '1650878587072',
       *   balance_accounts: [
       *     {
       *       user_id: xxxxx,
       *       type: 'CASHBACK',
       *       currency: 'USDTSSS',
       *       created_at: '1650878587072',
       *       updated_at: '1650878587072',
       *       actual_balance: '2.123',
       *       available_balance: '2.123',
       *       id: 441
       *     }
       *   ],
       *   balance_transactions: [
       *     {
       *       reference_id: 'xxxxx',
       *       type: 'REWARD',
       *       balance_account_id: 441,
       *       onHoldTransactionId: null,
       *       amount: '2.123',
       *       created_at: '1650878587072',
       *       id: '1298'
       *     }
       *   ],
       *   on_hold_transactions: []
       * }
       */
      const result = await firstValueFrom(
        await this.httpService
          .post(postBoUrl, JSON.stringify(postData), {
            headers: {
              //   Authorization: 'Bearer ' + boToken,
              'Content-Type': 'application/json',
            },
          })
          .pipe(map((response) => response.data)),
      )
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm015',
        data: input.data,
        extraData: {
          result: JSON.stringify(result),
        },
        params: { type: 'cashback' },
      })
      if (!result) {
        return null
      }
      return result
    } catch (e) {
      this.logger.log(e)
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm018',
        data: input.data,
        extraData: {
          statusCode: e.response.status,
          statusText: e.response.statusText,
          detailMessage: e.response.data.message,
        },
        params: { type: 'cashback' },
      })
      return null
    }
  }
}
