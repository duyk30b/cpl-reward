import { Expose } from 'class-transformer'

export class CreateMissionDto {
  @Expose({ name: 'campaign_id' })
  campaignId: number

  @Expose()
  title: string

  @Expose({ name: 'detail_explain' })
  detailExplain: string

  @Expose({ name: 'opening_date' })
  openingDate: number

  @Expose({ name: 'closing_date' })
  closingDate: number

  @Expose({ name: 'judgment_conditions' })
  judgmentConditions: string

  @Expose({ name: 'user_conditions' })
  userConditions: string

  @Expose({ name: 'grant_target' })
  grantTarget: string
}
