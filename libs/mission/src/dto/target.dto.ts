import { Expose } from 'class-transformer'

export class TargetDto {
  @Expose()
  user: string

  @Expose({ name: 'grant_method' })
  grantMethod: string

  @Expose()
  amount: number

  @Expose({ name: 'property_to_calculate_amount' })
  propertyToCalculateAmount: string

  @Expose()
  currency: string

  @Expose()
  wallet: string

  @Expose()
  type?: string

  @Expose({ name: 'tag_ids' })
  tagIds?: Array<number>
}
