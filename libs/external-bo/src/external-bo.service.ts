import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { firstValueFrom, map } from 'rxjs'
import { ChangeUserCashback } from './external-bo.interface'

@Injectable()
export class ExternalBoService {
  private readonly logger = new Logger(ExternalBoService.name)

  constructor(
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
    const boToken = this.configService.get('bo.token')
    const postBoUrl = this.configService.get('bo.url') + '/transaction/create'

    const postData = {
      ...input,
      balance_type: 'CASHBACK',
      transaction_type: 'MANUALLY',
      reference_id: '',
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
            // headers: {
            //   Authorization: 'Bearer ' + boToken,
            //   'Content-Type': 'application/json',
            // },
          })
          .pipe(map((response) => response.data)),
      )
      if (!result) {
        return null
      }
      return result
    } catch (e) {
      this.logger.error(e)
    }
  }
}
