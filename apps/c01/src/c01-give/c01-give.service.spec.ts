import { Test, TestingModule } from '@nestjs/testing'
import { C01GiveService } from './c01-give.service'

describe('C01GiveService', () => {
  let service: C01GiveService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [C01GiveService],
    }).compile()

    service = module.get<C01GiveService>(C01GiveService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
