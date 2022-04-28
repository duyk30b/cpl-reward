export class ListMissionUserLogDto {
  page: number
  limit: number
  sort: string
  sortType: 'ASC' | 'DESC'
}

export const MissionUserSortable = [
  'reward_history_id',
  'campaign_id',
  'mission_id',
  'user_id',
  'created_at',
]
