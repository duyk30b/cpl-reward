import { Controller } from '@nestjs/common'
import { ApiMissionService } from './api-mission.service'

@Controller('missions')
export class ApiMissionController {
  constructor(private readonly apiMissionService: ApiMissionService) {}
}
