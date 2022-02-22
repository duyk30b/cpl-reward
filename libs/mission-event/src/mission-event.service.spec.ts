import { Test, TestingModule } from '@nestjs/testing'
import { MissionEventService } from './mission-event.service'

describe('MissionEventService', () => {
  let service: MissionEventService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MissionEventService],
    }).compile()

    service = module.get<MissionEventService>(MissionEventService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
