import { Test, TestingModule } from '@nestjs/testing'
import { ExternalBoService } from './external-bo.service'

describe('ExternalBoService', () => {
  let service: ExternalBoService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExternalBoService],
    }).compile()

    service = module.get<ExternalBoService>(ExternalBoService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
