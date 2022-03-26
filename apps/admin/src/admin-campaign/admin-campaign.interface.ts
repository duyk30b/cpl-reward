import { Expose } from 'class-transformer'
// import { Expose, Type } from 'class-transformer'
// import { CreateRewardRuleDto } from '@lib/reward-rule/dto/create-reward-rule.dto'
// import { UpdateRewardRuleDto } from '@lib/reward-rule/dto/update-reward-rule.dto'

export interface CancelInput {
  campaignId: number
}

export interface FindOneInput {
  id: number
}

export interface ICampaignFilter {
  page?: number
  limit?: number
  searchField?: string
  searchText?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
}

export class CampaignInput {
  @Expose()
  title: string
  @Expose()
  description: string
  @Expose({ name: 'detail_explain' })
  detailExplain: string
  @Expose({ name: 'start_date' })
  startDate: number
  @Expose({ name: 'end_date' })
  endDate: number
  @Expose({ name: 'notification_link' })
  notificationLink: string
  @Expose({ name: 'campaign_image' })
  campaignImage: string
  @Expose()
  priority?: number
  @Expose({ name: 'is_system' })
  isSystem?: boolean
  @Expose()
  status?: number
}

export class CreateCampaignInput extends CampaignInput {
  // @Type(() => CreateRewardRuleDto)
  // @Expose({ name: 'reward_rules' })
  // rewardRules: CreateRewardRuleDto[]
}

export class UpdateCampaignInput extends CampaignInput {
  @Expose()
  id: number
  // @Expose({ name: 'reward_rules' })
  // @Type(() => UpdateRewardRuleDto)
  // rewardRules: UpdateRewardRuleDto[]
}
