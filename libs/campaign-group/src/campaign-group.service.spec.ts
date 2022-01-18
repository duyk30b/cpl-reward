import { Test, TestingModule } from '@nestjs/testing'
import { CampaignGroupService } from './campaign-group.service'

describe('CampaignGroupService', () => {
  let service: CampaignGroupService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CampaignGroupService],
    }).compile()

    service = module.get<CampaignGroupService>(CampaignGroupService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
