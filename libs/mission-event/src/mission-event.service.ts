import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MissionEvent } from '@lib/mission-event/entities/mission-event.entity'
import { plainToInstance } from 'class-transformer'
import { CreateMissionEventDto } from '@lib/mission-event/dto/create-mission-event.dto'

@Injectable()
export class MissionEventService {
  constructor(
    @InjectRepository(MissionEvent)
    private missionEventRepository: Repository<MissionEvent>,
  ) {}

  async create(
    createMissionEventDto: CreateMissionEventDto,
  ): Promise<MissionEvent> {
    const missionEventEntity = plainToInstance(
      MissionEvent,
      createMissionEventDto,
      {
        ignoreDecorators: true,
      },
    )
    return await this.missionEventRepository.save(missionEventEntity)
  }

  async delete(campaignId: number, missionId: number) {
    return await this.missionEventRepository.delete({ campaignId, missionId })
  }
}
