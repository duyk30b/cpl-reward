import {
  CreateRewardRule,
  UpdateRewardRule,
} from '../admin-common/admin-common.interface'
import { Expose, Type } from 'class-transformer'

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
  @Type(() => CreateRewardRule)
  @Expose({ name: 'reward_rules' })
  rewardRules: CreateRewardRule[]
}

export class UpdateCampaignInput extends CampaignInput {
  @Expose()
  id: number
  @Expose({ name: 'reward_rules' })
  @Type(() => UpdateRewardRule)
  rewardRules: UpdateRewardRule[]
}
