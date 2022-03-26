import { Expose } from 'class-transformer'

export class ReferredUserInfoDto {
  @Expose({ name: 'referred_user_id' })
  referredUserId: number

  @Expose()
  user: number

  @Expose()
  amount: string

  @Expose()
  currency: number

  @Expose()
  wallet: number

  @Expose()
  type: string
}
