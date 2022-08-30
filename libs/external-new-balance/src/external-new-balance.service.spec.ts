import { Test, TestingModule } from '@nestjs/testing'
import { ExternalNewBalanceService } from './external-new-balance.service'

describe('ExternalNewBalanceService', () => {
  let service: ExternalNewBalanceService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExternalNewBalanceService],
    }).compile()

    service = module.get<ExternalNewBalanceService>(ExternalNewBalanceService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
