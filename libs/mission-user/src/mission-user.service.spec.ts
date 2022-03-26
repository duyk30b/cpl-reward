import { Test, TestingModule } from '@nestjs/testing'
import { MissionUserService } from './mission-user.service'

describe('CampaignUserService', () => {
  let service: MissionUserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MissionUserService],
    }).compile()

    service = module.get<MissionUserService>(MissionUserService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
