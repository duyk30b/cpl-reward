import { Test, TestingModule } from '@nestjs/testing'
import { ExternalBalanceService } from './external-balance.service'

describe('ExternalBalanceService', () => {
  let service: ExternalBalanceService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExternalBalanceService],
    }).compile()

    service = module.get<ExternalBalanceService>(ExternalBalanceService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
