import { Expose, Type } from 'class-transformer'
import { JudgmentConditionDto } from '@lib/mission/dto/judgment-condition.dto'
import { UserConditionDto } from '@lib/mission/dto/user-condition.dto'

export class GrpcMissionDto {
  @Expose({ name: 'campaign_id' })
  campaignId: number

  @Expose()
  title: string

  @Expose({ name: 'detail_explain' })
  detailExplain: string

  @Expose({ name: 'title_jp' })
  titleJp: string

  @Expose({ name: 'description_jp' })
  descriptionJp: string

  @Expose({ name: 'guide_link_jp' })
  guideLinkJp: string

  @Expose({ name: 'opening_date' })
  openingDate: number

  @Expose({ name: 'closing_date' })
  closingDate: number

  @Expose({ name: 'judgment_conditions' })
  @Type(() => JudgmentConditionDto)
  judgmentConditions: JudgmentConditionDto[]

  @Expose({ name: 'user_conditions' })
  @Type(() => UserConditionDto)
  userConditions: UserConditionDto[]

  @Expose({ name: 'grant_target' })
  @Type(() => GrpcTarget)
  grantTarget: GrpcTarget[]

  @Expose()
  priority?: number

  @Expose({ name: 'guide_link' })
  guideLink: string

  @Expose({ name: 'limit_received_reward' })
  limitReceivedReward?: number

  @Expose({ name: 'grant_target' })
  @Type(() => GrpcRewardRule)
  rewardRules: GrpcRewardRule[]
}

class GrpcTarget {
  @Expose()
  user: string

  @Expose()
  amount: string

  @Expose()
  currency: string

  @Expose()
  wallet: string

  @Expose()
  type?: string
}

class GrpcRewardRule {
  @Expose({ name: 'type_rule' })
  typeRule: string

  @Expose()
  key: string

  @Expose()
  currency: string

  @Expose({ name: 'limit_value' })
  limitValue: string

  @Expose({ name: 'release_value' })
  releaseValue?: string
}
