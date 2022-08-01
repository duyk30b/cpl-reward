import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { firstValueFrom } from 'rxjs'
import { map } from 'rxjs'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { WalletServiceInterface } from '@libs/wallet-gateway/wallet.service.interface'
import { EventEmitterType } from '@lib/common'

@Injectable()
export class ExternalBalanceService implements WalletServiceInterface {
  eventEmit = EventEmitterType.WRITE_LOG
  private readonly logger = new Logger(ExternalBalanceService.name)

  constructor(
    private eventEmitter: EventEmitter2,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async changeUserBalance(
    userId: string,
    amount: string,
    currency: string,
    type: string,
    data: any,
  ): Promise<any> {
    currency = currency.toLowerCase()
    const balanceToken = this.configService.get('balance.token')
    const postBalanceUrl =
      this.configService.get('balance.url') +
      '/user_balances/' +
      userId.toString() +
      '/' +
      currency

    const postData = {
      amount: amount,
      type: type,
      api_token: balanceToken,
    }
    try {
      const result = await firstValueFrom(
        await this.httpService
          .post(postBalanceUrl, JSON.stringify(postData), {
            headers: {
              // Authorization: 'Bearer ' + balanceToken,
              // Use api_token on body instead of Authorization on header.
              // Because Authorization blocked by KONG gateway to validate Customer/Auth 's access token
              'Content-Type': 'application/json',
            },
          })
          .pipe(map((response) => response.data)),
      )
      if (result && result.api_token) {
        result.api_token = '***'
      }
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'log',
        traceCode: 'm015',
        data,
        extraData: {
          request: postData,
          result: JSON.stringify(result),
        },
        params: { type: 'balance' },
      })
      if (!result) {
        return {
          result: false,
          message: 'Cant get response',
        }
      }

      return {
        result: true,
        message: '',
      }
    } catch (e) {
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'error',
        traceCode: 'm018',
        data,
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
        params: { type: 'balance' },
      })

      return {
        result: false,
        message:
          e.response === undefined
            ? e.message
            : {
                statusCode: e.response.status,
                statusText: e.response.statusText,
                detailMessage: e.response.data.message,
              },
      }
    }
  }
}
