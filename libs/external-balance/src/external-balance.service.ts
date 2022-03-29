import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { firstValueFrom } from 'rxjs'
import { map } from 'rxjs'

@Injectable()
export class ExternalBalanceService {
  private readonly logger = new Logger(ExternalBalanceService.name)

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async changeUserBalance(
    userId: number,
    amount: number,
    currency: string,
    type: string,
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
      if (!result) {
        return null
      }
      return result
    } catch (e) {
      this.logger.log(e)
    }
  }
}
