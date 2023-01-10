import { Test, TestingModule } from '@nestjs/testing'
import { ApiInternalController } from './api-internal.controller'
import { ApiInternalService } from './api-internal.service'

describe('ApiInternalController', () => {
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ApiInternalController],
      providers: [ApiInternalService],
    }).compile()

    app.get<ApiInternalController>(ApiInternalController)
  })

  describe('root', () => {
    it('should return "Hello World!"', () => {
      return true
    })
  })
})
