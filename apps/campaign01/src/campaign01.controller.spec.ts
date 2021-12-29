import { Test, TestingModule } from '@nestjs/testing'
import { Campaign01Controller } from './campaign01.controller'
import { Campaign01Service } from './campaign01.service'

describe('Campaign01Controller', () => {
  let campaign01Controller: Campaign01Controller

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [Campaign01Controller],
      providers: [Campaign01Service],
    }).compile()

    campaign01Controller = app.get<Campaign01Controller>(Campaign01Controller)
  })

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(campaign01Controller.getHello()).toBe('Hello World!')
    })
  })
})
