import { PartialType } from '@nestjs/swagger'
import { CreateMissionDto } from './create-mission.dto'
import { Expose } from 'class-transformer'

export class UpdateMissionDto extends PartialType(CreateMissionDto) {
  @Expose()
  id: number
}
