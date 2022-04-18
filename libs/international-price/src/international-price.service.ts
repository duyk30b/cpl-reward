import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InternationalPrice } from '@lib/international-price/entities/international-price.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class InternationalPriceService {
  constructor(
    @InjectRepository(InternationalPrice, 'bce')
    private readonly priceRepository: Repository<InternationalPrice>,
  ) {}

  async getPriceInUsdt(coin: string): Promise<InternationalPrice> {
    return await this.priceRepository
      .createQueryBuilder('international_prices')
      .where('currency = :currency AND coin = (:coin)', {
        currency: 'usdt',
        coin: coin.toLocaleLowerCase(),
      })
      .orderBy('id', 'DESC')
      .getOne()
  }
}
