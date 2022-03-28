import { Test, TestingModule } from '@nestjs/testing'
import { ExternalCashbackService } from './external-cashback.service'

describe('ExternalCashbackService', () => {
  let service: ExternalCashbackService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExternalCashbackService],
    }).compile()

    service = module.get<ExternalCashbackService>(ExternalCashbackService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
