import { Test, TestingModule } from '@nestjs/testing'
import { UserCheckinLogService } from './user-checkin-log.service'

describe('UserCheckinLogService', () => {
  let service: UserCheckinLogService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserCheckinLogService],
    }).compile()

    service = module.get<UserCheckinLogService>(UserCheckinLogService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
