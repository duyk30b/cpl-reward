import { Expose } from 'class-transformer'

export class CreateMissionDto {
  @Expose()
  campaignId: number

  @Expose()
  title: string

  @Expose()
  detailExplain: string

  @Expose()
  openingDate: number

  @Expose()
  closingDate: number

  // @Expose({ name: 'judgment_conditions' })
  // judgmentConditions: string
  //
  // @Expose({ name: 'user_conditions' })
  // userConditions: string
  //
  // @Expose({ name: 'grant_target' })
  // grantTarget: string
}
