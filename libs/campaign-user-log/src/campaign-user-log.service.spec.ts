import { Test, TestingModule } from '@nestjs/testing'
import { CampaignUserLogService } from './campaign-user-log.service'

describe('CampaignUserLogService', () => {
  let service: CampaignUserLogService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CampaignUserLogService],
    }).compile()

    service = module.get<CampaignUserLogService>(CampaignUserLogService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
