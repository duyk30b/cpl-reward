import { Injectable } from '@nestjs/common'
import { MissionService } from '@app/mission'

@Injectable()
export class ApiMissionService {
  constructor(private readonly missionService: MissionService) {}
}
