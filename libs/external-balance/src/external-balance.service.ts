import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { firstValueFrom } from 'rxjs'
import { map } from 'rxjs'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class ExternalBalanceService {
  eventEmit = 'write_log'
  private readonly logger = new Logger(ExternalBalanceService.name)

  constructor(
    private eventEmitter: EventEmitter2,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async changeUserBalance(
    userId: string,
    amount: number,
    currency: string,
    type: string,
    data: any,
  ): Promise<any> {
    const balanceToken = this.configService.get('balance.token')
    const postBalanceUrl =
      this.configService.get('balance.url') +
      '/user_balances/' +
      userId.toString() +
      '/' +
      currency

    try {
      const result = firstValueFrom(
        await this.httpService
          .post(
            postBalanceUrl,
            JSON.stringify({
              amount: amount,
              type: type,
              api_token: balanceToken,
            }),
            {
              headers: {
                // Authorization: 'Bearer ' + balanceToken,
                // Use api_token on body instead of Authorization on header.
                // Because Authorization blocked by KONG gateway to validate Customer/Auth 's access token
                'Content-Type': 'application/json',
              },
            },
          )
          .pipe(map((response) => response.data)),
      )
      this.eventEmitter.emit(this.eventEmit, {
        logLevel: 'warn',
        traceCode: 'm015',
        data,
        extraData: {
          result: JSON.stringify(result),
        },
        params: { type: 'balance' },
      })
      if (!result) {
        return null
      }
      return result
    } catch (e) {
      this.logger.log(e)
      return null
    }
  }
}
