import { Expose } from 'class-transformer'

export class CreateActionLogInput {
  @Expose({ name: 'admin_id' })
  adminId: number
  @Expose({ name: 'action_name' })
  actionName: string
  @Expose({ name: 'content_date' })
  contentData: string
}

export class CreateRewardRule {
  @Expose()
  key: string
  @Expose()
  currency: string
  @Expose({ name: 'limit_value' })
  limitValue: number
  @Expose({ name: 'campaign_id' })
  campaignId: number
  @Expose({ name: 'mission_id' })
  missionId: number
  @Expose({ name: 'type_rule' })
  typeRule: string
}

export class UpdateRewardRule extends CreateRewardRule {
  @Expose()
  id: number
}
