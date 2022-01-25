import { Test, TestingModule } from '@nestjs/testing'
import { ApiCampaignController } from './api-campaign.controller'
import { ApiCampaignService } from './api-campaign.service'

describe('ApiCampaignGroupController', () => {
  let controller: ApiCampaignController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiCampaignController],
      providers: [ApiCampaignService],
    }).compile()

    controller = module.get<ApiCampaignController>(ApiCampaignController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
