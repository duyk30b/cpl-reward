import { Controller, OnModuleInit } from '@nestjs/common'
import { AdminMissionService } from './admin-mission.service'
import { GrpcMethod } from '@nestjs/microservices'
import { FindOneInput } from '../admin-campaign/admin-campaign.interface'
import {
  ICreateMission,
  IUpdateMission,
  MissionFilterInput,
} from './admin-mission.interface'
import * as moment from 'moment-timezone'

@Controller('mission')
export class AdminMissionController implements OnModuleInit {
  constructor(private readonly adminMissionService: AdminMissionService) {}

  /**
   * TODO: replace by queue in next sprint
   */
  async onModuleInit() {
    setInterval(async () => {
      await this.adminMissionService.updateEndedStatus(moment().unix())
    }, 60000)
  }

  @GrpcMethod('GrpcAdminMissionService', 'Create')
  async create(data: ICreateMission) {
    return await this.adminMissionService.create(data)
  }

  @GrpcMethod('GrpcAdminMissionService', 'Update')
  async update(data: IUpdateMission) {
    return await this.adminMissionService.update(data)
  }

  @GrpcMethod('GrpcAdminMissionService', 'FindOne')
  async findOne(data: FindOneInput) {
    return await this.adminMissionService.findOne(+data.id)
  }

  @GrpcMethod('GrpcAdminMissionService', 'GetMissionsByCampaign')
  async getMissionsByCampaign(input: MissionFilterInput) {
    return await this.adminMissionService.getMissionsByCampaign(input)
  }
}
