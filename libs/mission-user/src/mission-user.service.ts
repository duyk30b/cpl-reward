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
    id: number,
    updateMissionUserDto: UpdateMissionUserDto,
    limitReceivedReward: number,
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
      excludePrefixes: ['id'],
    })
    return this.missionUserRepository
      .createQueryBuilder()
      .update(MissionUser)
      .set(missionUserEntity)
      .where('id = :id', { id })
      .andWhere('successCount < :success_count', {
        success_count: limitReceivedReward,
      })
      .execute()
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
    return this.missionUserRepository.save(missionUserEntity)
  }

  async increaseSuccessCount(id: number, limit: number) {
    return this.missionUserRepository
      .createQueryBuilder()
      .update(MissionUser)
      .where('id = :id', { id })
      .andWhere('(success_count + 1) <= :limit')
      .set({
        successCount: () => 'success_count + 1',
      })
      .setParameters({ limit: limit })
      .execute()
  }

  async findOne(condition) {
    return this.missionUserRepository.findOne(condition)
  }
}
