import { Test, TestingModule } from '@nestjs/testing'
import { CampaignUserService } from './campaign-user.service'

describe('CampaignUserService', () => {
  let service: CampaignUserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CampaignUserService],
    }).compile()

    service = module.get<CampaignUserService>(CampaignUserService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
