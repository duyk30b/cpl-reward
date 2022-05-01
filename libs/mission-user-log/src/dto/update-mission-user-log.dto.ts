import { Expose } from 'class-transformer'

export class UpdateMissionUserLogDto {
  @Expose()
  status: number
}
