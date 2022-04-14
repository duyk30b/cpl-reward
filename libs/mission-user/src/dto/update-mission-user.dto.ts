import { Expose } from 'class-transformer'

export class UpdateMissionUserDto {
  @Expose({ name: 'success_count' })
  successCount: number
}
