import { Expose } from 'class-transformer'

export class CreateRewardRuleDto {
  @Expose({ name: 'campaign_id' })
  campaignId: number

  @Expose({ name: 'mission_id' })
  missionId: number

  @Expose({ name: 'type_rule' })
  typeRule: string

  @Expose()
  key: string

  @Expose()
  currency: string

  @Expose({ name: 'limit_value' })
  limitValue: number

  @Expose({ name: 'release_value' })
  releaseValue?: number
}
