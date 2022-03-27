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

export class ICampaign {
  @Expose()
  title: string
  @Expose({ name: 'title_jp' })
  titleJp: string

  @Expose()
  description: string
  @Expose({ name: 'description_jp' })
  descriptionJp: string

  // @Expose({ name: 'detail_explain' })
  // detailExplain: string
  //
  // @Expose({ name: 'detail_explain_jp' })
  // detailExplainJp: string

  @Expose({ name: 'start_date' })
  startDate: number
  @Expose({ name: 'end_date' })
  endDate: number

  @Expose({ name: 'notification_link' })
  notificationLink: string
  @Expose({ name: 'notification_link_jp' })
  notificationLinkJp: string

  @Expose({ name: 'campaign_image' })
  campaignImage: string
  @Expose({ name: 'campaign_image_jp' })
  campaignImageJp: string

  @Expose()
  priority?: number
  @Expose({ name: 'is_system' })
  isSystem?: boolean
  @Expose()
  status?: number
  @Expose({ name: 'is_active' })
  isActive?: number
}

export class ICreateCampaign extends ICampaign {
  // @Type(() => CreateRewardRuleDto)
  // @Expose({ name: 'reward_rules' })
  // rewardRules: CreateRewardRuleDto[]
}

export class IUpdateCampaign extends ICampaign {
  @Expose()
  id: number
  // @Expose({ name: 'reward_rules' })
  // @Type(() => UpdateRewardRuleDto)
  // rewardRules: UpdateRewardRuleDto[]
}
