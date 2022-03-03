import { Expose } from 'class-transformer'

export class CreateRewardRuleDto {
  @Expose()
  campaignId?: number

  @Expose()
  missionId?: number

  @Expose()
  typeRule?: string

  @Expose()
  key: string

  @Expose()
  currency: string

  @Expose()
  limitValue: number

  @Expose()
  releaseValue?: number
}
