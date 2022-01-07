import { IsNotEmpty } from 'class-validator'
import { Expose } from 'class-transformer'

export class HlUserSpendMoneyDto {
  @IsNotEmpty()
  @Expose({ name: 'user_id' })
  userId: number

  @IsNotEmpty()
  @Expose()
  money: number
}
