import { IsNotEmpty } from 'class-validator'
import { Expose } from 'class-transformer'

export class HlUserSpendMoney {
  @IsNotEmpty()
  @Expose({ name: 'user_id' })
  userId: number

  @IsNotEmpty()
  @Expose()
  amount: number

  @IsNotEmpty()
  @Expose()
  currency: string
}
