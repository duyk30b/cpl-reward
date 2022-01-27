import { Test, TestingModule } from '@nestjs/testing'
import { RewardRuleService } from './reward-rule.service'

describe('RewardRuleService', () => {
  let service: RewardRuleService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RewardRuleService],
    }).compile()

    service = module.get<RewardRuleService>(RewardRuleService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
