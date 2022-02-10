import { Injectable } from '@nestjs/common'
import { MissionService } from '@app/mission'

@Injectable()
export class ApiMissionService {
  constructor(private readonly missionService: MissionService) {}

  async findAll(page: number, limit: number) {
    limit = limit > 100 ? 100 : limit
    return this.missionService.paginate({
      page,
      limit,
    })
  }

  async findOne(id: number) {
    const mission = await this.missionService.getById(id, {
      relations: ['rewardRules'],
    })
    if (!mission) {
      return null
    }
    if (mission.rewardRules.length > 0) {
      mission.rewardRules = mission.rewardRules.filter(
        (item) => item.typeRule == 'mission',
      )
    }

    return mission
  }
}
