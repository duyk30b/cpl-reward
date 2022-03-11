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

  // TODO: update later
  async upsert(createMissionEventDto: CreateMissionEventDto): Promise<void> {
    const missionEventEntity = plainToInstance(
      MissionEvent,
      createMissionEventDto,
      {
        ignoreDecorators: true,
      },
    )
    await this.missionEventRepository.upsert(missionEventEntity, {
      conflictPaths: ['missionId', 'campaignId', 'eventName'],
    })
  }
}
