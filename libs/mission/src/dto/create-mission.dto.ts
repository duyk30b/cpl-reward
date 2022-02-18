import { Expose, Type } from 'class-transformer'
import { ConditionDto } from '@lib/mission/dto/condition.dto'
import { TargetDto } from '@lib/mission/dto/target.dto'

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
  @Type(() => ConditionDto)
  judgmentConditions: ConditionDto[]

  @Expose({ name: 'user_conditions' })
  @Type(() => ConditionDto)
  userConditions: ConditionDto[]

  @Expose({ name: 'grant_target' })
  @Type(() => TargetDto)
  grantTarget: TargetDto[]
}
