import { Test, TestingModule } from '@nestjs/testing'
import { ApiCampaignGroupController } from './api-campaign-group.controller'
import { ApiCampaignGroupService } from './api-campaign-group.service'

describe('ApiCampaignGroupController', () => {
  let controller: ApiCampaignGroupController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiCampaignGroupController],
      providers: [ApiCampaignGroupService],
    }).compile()

    controller = module.get<ApiCampaignGroupController>(
      ApiCampaignGroupController,
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
