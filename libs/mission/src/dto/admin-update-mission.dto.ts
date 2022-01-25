import { PartialType } from '@nestjs/swagger'
import { CreateMissionDto } from './create-mission.dto'
import { Expose } from 'class-transformer'

export class AdminUpdateMissionDto extends PartialType(CreateMissionDto) {
  @Expose()
  id: number
}
