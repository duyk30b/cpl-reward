export class ListMissionUserLogDto {
  page: number
  limit: number
  sort: string
  sortType: 'ASC' | 'DESC'
}

export const MissionUserSortable = [
  'id',
  'campaign_id',
  'mission_id',
  'user_id',
  'created_at',
]
