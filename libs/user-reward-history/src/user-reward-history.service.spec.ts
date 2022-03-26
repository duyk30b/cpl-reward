import { Test, TestingModule } from '@nestjs/testing'
import { UserRewardHistoryService } from './user-reward-history.service'

describe('UserRewardHistoryService', () => {
  let service: UserRewardHistoryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRewardHistoryService],
    }).compile()

    service = module.get<UserRewardHistoryService>(UserRewardHistoryService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
