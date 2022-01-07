import { Test, TestingModule } from '@nestjs/testing'
import { C01VerifyService } from './c01-verify.service'

describe('C01VerifyService', () => {
  let service: C01VerifyService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [C01VerifyService],
    }).compile()

    service = module.get<C01VerifyService>(C01VerifyService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
