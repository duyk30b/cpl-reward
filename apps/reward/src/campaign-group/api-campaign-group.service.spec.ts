import { Test, TestingModule } from '@nestjs/testing'
import { ApiCampaignGroupService } from './api-campaign-group.service'

describe('ApiCampaignGroupService', () => {
  let service: ApiCampaignGroupService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiCampaignGroupService],
    }).compile()

    service = module.get<ApiCampaignGroupService>(ApiCampaignGroupService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
