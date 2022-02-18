import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MissionUser } from '@lib/mission-user/entities/mission-user.entity'
import { plainToInstance } from 'class-transformer'

@Injectable()
export class MissionUserService {
  constructor(
    @InjectRepository(MissionUser)
    private missionUserRepository: Repository<MissionUser>,
  ) {}

  async update(missionId: number, userId: number, dataToUpdate: any) {
    return await this.missionUserRepository.update(
      { missionId: missionId, userId: userId },
      plainToInstance(MissionUser, dataToUpdate, {
        ignoreDecorators: true,
      }),
    )
  }

  async save(campaignUser: MissionUser) {
    return await this.missionUserRepository.save(campaignUser)
  }

  async getMissionUser(missionId: number, userId: number) {
    return await this.missionUserRepository.findOne({
      missionId: missionId,
      userId: userId,
    })
  }
}
