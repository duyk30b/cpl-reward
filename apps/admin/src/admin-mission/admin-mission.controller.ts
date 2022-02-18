import { Controller } from '@nestjs/common'
import { AdminMissionService } from './admin-mission.service'
import { GrpcMethod } from '@nestjs/microservices'
import { FindOneInput } from '../admin-campaign/admin-campaign.interface'
import { ApiCreateMissionDto } from './dto/api-create-mission.dto'
import { ApiUpdateMissionDto } from './dto/api-update-mission.dto'

@Controller('mission')
export class AdminMissionController {
  constructor(private readonly adminMissionService: AdminMissionService) {}

  @GrpcMethod('GrpcAdminMissionService', 'Create')
  async create(data: ApiCreateMissionDto) {
    return await this.adminMissionService.create(data)
  }

  @GrpcMethod('GrpcAdminMissionService', 'Update')
  async update(data: ApiUpdateMissionDto) {
    return await this.adminMissionService.update(data)
  }

  @GrpcMethod('GrpcAdminMissionService', 'FindOne')
  async findOne(data: FindOneInput) {
    return await this.adminMissionService.findOne(+data.id)
  }
}
