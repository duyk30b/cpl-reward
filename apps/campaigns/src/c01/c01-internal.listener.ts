import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { HlUserSpendMoney } from '@app/common/interfaces/hl-user-spend-money'
import { C01Service } from './c01.service'

@Injectable()
export class C01InternalListener {
  constructor(private readonly c01Service: C01Service) {}

  @OnEvent('hl_user_spend_money')
  handleOrderCreatedEvent(data: HlUserSpendMoney) {
    this.c01Service.main('hl_user_spend_money', data)
  }
}
