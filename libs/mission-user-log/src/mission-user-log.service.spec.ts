import { Test, TestingModule } from '@nestjs/testing'
import { MissionUserLogService } from './mission-user-log.service'

describe('CampaignUserLogService', () => {
  let service: MissionUserLogService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MissionUserLogService],
    }).compile()

    service = module.get<MissionUserLogService>(MissionUserLogService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
