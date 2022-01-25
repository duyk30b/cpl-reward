import { Test, TestingModule } from '@nestjs/testing'
import { ApiMissionController } from './api-mission.controller'
import { ApiMissionService } from './api-mission.service'

describe('CampaignController', () => {
  let controller: ApiMissionController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiMissionController],
      providers: [ApiMissionService],
    }).compile()

    controller = module.get<ApiMissionController>(ApiMissionController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
