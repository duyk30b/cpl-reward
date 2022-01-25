import { Test, TestingModule } from '@nestjs/testing'
import { ApiCampaignService } from './api-campaign-group.service'

describe('ApiCampaignGroupService', () => {
  let service: ApiCampaignService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiCampaignService],
    }).compile()

    service = module.get<ApiCampaignService>(ApiCampaignService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
