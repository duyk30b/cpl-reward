import { Test, TestingModule } from '@nestjs/testing'
import { ExternalUserTagService } from './external-user-tag.service'

describe('ExternalUserTagService', () => {
  let service: ExternalUserTagService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExternalUserTagService],
    }).compile()

    service = module.get<ExternalUserTagService>(ExternalUserTagService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
