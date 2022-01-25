import { Injectable } from '@nestjs/common'
import { MissionService } from '@app/mission'
import { ApiCreateMissionDto } from './dto/api-create-mission.dto'
import { ApiUpdateMissionDto } from './dto/api-update-mission.dto'

@Injectable()
export class ApiMissionService {
  constructor(private readonly missionService: MissionService) {}

  async create(apiCreateCampaignDto: ApiCreateMissionDto) {
    return await this.missionService.create(apiCreateCampaignDto)
  }

  async findOne(id: number) {
    return await this.missionService.getById(id)
  }

  async update(id: number, apiUpdateCampaignDto: ApiUpdateMissionDto) {
    return await this.missionService.update({ id, ...apiUpdateCampaignDto })
  }

  async findAll(page: number, limit: number) {
    limit = limit > 100 ? 100 : limit
    return this.missionService.paginate({
      page,
      limit,
    })
  }
}
