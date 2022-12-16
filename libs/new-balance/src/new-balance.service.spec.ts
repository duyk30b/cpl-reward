import { Test, TestingModule } from '@nestjs/testing'
import { NewBalanceService } from './new-balance.service'

describe('NewBalanceService', () => {
  let service: NewBalanceService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewBalanceService],
    }).compile()

    service = module.get<NewBalanceService>(NewBalanceService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
