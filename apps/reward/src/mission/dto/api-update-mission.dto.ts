import { PartialType } from '@nestjs/swagger'
import { ApiCreateMissionDto } from './api-create-mission.dto'

export class ApiUpdateMissionDto extends PartialType(ApiCreateMissionDto) {}
