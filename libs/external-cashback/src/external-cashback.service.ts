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
    input.currency = input.currency.toLowerCase()

    const postBoUrl =
      this.configService
        .get('cashback.url')
        .replace('service-api', 'service-internal') + '/transaction/create'

    const inputData = {
      user_id: input.user_id,
      currency: input.currency,
      amount: input.amount,
    }
    const postData = {
      ...inputData,
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
          request: postData,
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
          request: postData,
          response:
            e.response === undefined
              ? null
              : {
                  statusCode: e.response.status,
                  statusText: e.response.statusText,
                  detailMessage: e.response.data.message,
                },
        },
        params: { type: 'cashback' },
      })
      return null
    }
  }
}
