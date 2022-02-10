import { Controller } from '@nestjs/common'
import { AdminMissionService } from './admin-mission.service'
import { CreateInput, UpdateInput } from './admin-mission.interface'
import { GrpcMethod } from '@nestjs/microservices'
import { FindOneInput } from '../admin-campaign/admin-campaign.interface'

@Controller('mission')
export class AdminMissionController {
  constructor(private readonly adminMissionService: AdminMissionService) {}

  @GrpcMethod('GrpcAdminMissionService', 'Create')
  async create(data: CreateInput): Promise<any> {
    return await this.adminMissionService.create(data)
  }

  @GrpcMethod('GrpcAdminMissionService', 'Update')
  async update(data: UpdateInput): Promise<any> {
    return await this.adminMissionService.update(data)
  }

  @GrpcMethod('GrpcAdminMissionService', 'FindOne')
  async findOne(data: FindOneInput): Promise<any> {
    return await this.adminMissionService.findOne(+data.id)
  }
}
