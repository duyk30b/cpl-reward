import { Injectable } from '@nestjs/common'
import { ExternalBoService } from '@lib/external-bo'

@Injectable()
export class AppService {
  constructor(private readonly test: ExternalBoService) {}

  async testFn() {
    return this.test.changeUserCashback({
      user_id: 55094,
      currency: 'USDT',
      amount: '1.1111',
    })
  }
}
