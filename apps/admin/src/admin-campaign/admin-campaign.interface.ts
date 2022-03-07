import {
  CreateRewardRule,
  UpdateRewardRule,
} from '../admin-common/admin-common.interface'

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

interface CampaignInput {
  title: string
  description: string
  detailExplain: string
  startDate: number
  endDate: number
  notificationLink: string
  campaignImage: string
  priority?: number
  isSystem?: boolean
  status?: number
}

export interface CreateCampaignInput extends CampaignInput {
  rewardRules: CreateRewardRule[]
}

export interface UpdateCampaignInput extends CampaignInput {
  id: number
  rewardRules: UpdateRewardRule[]
}
