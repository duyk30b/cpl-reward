import { IsNotEmpty, ValidateNested } from 'class-validator'
import { Expose, Type } from 'class-transformer'

export class OrderData {
  @IsNotEmpty()
  @Expose()
  order_id: string

  @Expose()
  user_id: string

  @Expose()
  currency: string

  @Expose()
  coin: string

  @Expose()
  status: number

  @Expose()
  order_class: number

  @Expose()
  order_type: number

  @Expose()
  order_resource: number

  @Expose()
  price: string

  @Expose()
  filled_price: string

  @Expose()
  user_type: number

  @Expose()
  time_frame_setting: string
}

export class Filled {
  @Expose()
  gross_volume: string

  @Expose()
  price: string

  @Expose()
  match_time: string

  @Expose()
  net_volume: string
}

export class Order {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => OrderData)
  origin: OrderData

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => OrderData)
  match: OrderData
}

export class Data {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => Order)
  order: Order

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => Filled)
  filled: Filled
}

export class ExchangeConfirmOrderMatchDto {
  @Expose()
  create_time: string

  @Expose()
  version: number

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => Data)
  data: Data
}

export class KafkaExchangeConfirmOrderMatchDto {
  @Expose()
  key: string

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => ExchangeConfirmOrderMatchDto)
  value: ExchangeConfirmOrderMatchDto
}
