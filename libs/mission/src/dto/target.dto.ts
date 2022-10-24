import { Expose } from 'class-transformer'
import { GRANT_METHOD } from '@lib/mission'

export class TargetDto {
  @Expose()
  user: string

  @Expose({ name: 'grant_method' })
  grantMethod: string = GRANT_METHOD.FIXED

  @Expose()
  amount: number

  @Expose({ name: 'property_to_calculate_amount' })
  propertyToCalculateAmount = ''

  @Expose()
  currency: string

  @Expose()
  wallet: string

  @Expose()
  type?: string

  @Expose({ name: 'tag_ids' })
  tagIds?: Array<number>
}
