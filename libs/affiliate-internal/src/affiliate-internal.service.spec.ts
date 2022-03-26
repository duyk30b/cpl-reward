import { Test, TestingModule } from '@nestjs/testing'
import { AffiliateInternalService } from './affiliate-internal.service'

describe('AffiliateInternalService', () => {
  let service: AffiliateInternalService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AffiliateInternalService],
    }).compile()

    service = module.get<AffiliateInternalService>(AffiliateInternalService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
