import { Expose } from 'class-transformer'

export class TargetDto {
  @Expose()
  user: string

  @Expose()
  amount: number

  @Expose()
  currency: string

  @Expose()
  wallet: string

  @Expose()
  type?: string

  @Expose({ name: 'tag_ids' })
  tagIds?: Array<number>
}
