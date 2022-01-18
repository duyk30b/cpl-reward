import { Test, TestingModule } from '@nestjs/testing'
import { CampaignGroupMapService } from './campaign-group-map.service'

describe('CampaignGroupMapService', () => {
  let service: CampaignGroupMapService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CampaignGroupMapService],
    }).compile()

    service = module.get<CampaignGroupMapService>(CampaignGroupMapService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
