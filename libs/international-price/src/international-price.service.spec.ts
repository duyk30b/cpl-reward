import { Test, TestingModule } from '@nestjs/testing'
import { InternationalPriceService } from './international-price.service'

describe('InternationalPriceService', () => {
  let service: InternationalPriceService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InternationalPriceService],
    }).compile()

    service = module.get<InternationalPriceService>(InternationalPriceService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
