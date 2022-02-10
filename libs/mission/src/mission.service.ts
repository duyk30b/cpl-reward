import { Injectable } from '@nestjs/common'
import { Mission } from '@app/mission/entities/mission.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate'
import { CreateMissionDto } from '@app/mission/dto/create-mission.dto'
import { plainToInstance } from 'class-transformer'
import { UpdateMissionDto } from '@app/mission/dto/update-mission.dto'

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
  ) {}

  async getById(id: number, options = undefined): Promise<Mission> {
    return await this.missionRepository.findOne(id, options)
  }

  async update(updateMissionDto: UpdateMissionDto): Promise<Mission> {
    const missionEntity = plainToInstance(Mission, updateMissionDto, {
      ignoreDecorators: true,
    })
    return await this.missionRepository.save(missionEntity)
  }

  async create(createMissionDto: CreateMissionDto): Promise<Mission> {
    const missionEntity = plainToInstance(Mission, createMissionDto, {
      ignoreDecorators: true,
    })
    return await this.missionRepository.save(missionEntity)
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Mission>> {
    const queryBuilder = this.missionRepository.createQueryBuilder('c')
    queryBuilder.orderBy('c.id', 'DESC')

    return paginate<Mission>(queryBuilder, options)
  }
}
