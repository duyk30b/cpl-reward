import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MissionUser } from '@lib/mission-user/entities/mission-user.entity'
import { plainToInstance } from 'class-transformer'
import { CreateMissionUserDto } from '@lib/mission-user/dto/create-mission-user.dto'
import { UpdateMissionUserDto } from '@lib/mission-user/dto/update-mission-user.dto'

@Injectable()
export class MissionUserService {
  constructor(
    @InjectRepository(MissionUser)
    private missionUserRepository: Repository<MissionUser>,
  ) {}

  async update(
    missionId: number,
    userId: number,
    updateMissionUserDto: UpdateMissionUserDto,
  ) {
    const updateMissionUser = plainToInstance(
      UpdateMissionUserDto,
      updateMissionUserDto,
      {
        ignoreDecorators: true,
        excludeExtraneousValues: true,
      },
    )
    const missionUserEntity = plainToInstance(MissionUser, updateMissionUser, {
      ignoreDecorators: true,
    })
    return await this.missionUserRepository.update(
      { missionId: missionId, userId: userId },
      missionUserEntity,
    )
  }

  async save(missionUserDto: CreateMissionUserDto) {
    const createMissionUser = plainToInstance(
      CreateMissionUserDto,
      missionUserDto,
      {
        ignoreDecorators: true,
        excludeExtraneousValues: true,
      },
    )
    const missionUserEntity = plainToInstance(MissionUser, createMissionUser, {
      ignoreDecorators: true,
    })
    return await this.missionUserRepository.save(missionUserEntity)
  }

  async getOneMissionUser(condition) {
    return await this.missionUserRepository.findOne(condition)
  }
}
