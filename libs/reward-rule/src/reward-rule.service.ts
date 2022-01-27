import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RewardRule } from '@app/reward-rule/entities/reward-rule.entity'
import { CreateRewardRuleDto } from '@app/reward-rule/dto/create-reward-rule.dto'
import { plainToInstance } from 'class-transformer'
import { UpdateRewardRuleDto } from '@app/reward-rule/dto/update-reward-rule.dto'

@Injectable()
export class RewardRuleService {
  constructor(
    @InjectRepository(RewardRule)
    private rewardRuleRepository: Repository<RewardRule>,
  ) {}

  async create(createRewardRuleDto: CreateRewardRuleDto): Promise<RewardRule> {
    createRewardRuleDto = plainToInstance(
      CreateRewardRuleDto,
      createRewardRuleDto,
      {
        excludeExtraneousValues: true,
      },
    )

    const rewardRuleEntity = plainToInstance(RewardRule, createRewardRuleDto, {
      ignoreDecorators: true,
    })

    return await this.rewardRuleRepository.save(rewardRuleEntity)
  }

  async update(updateRewardRuleDto: UpdateRewardRuleDto): Promise<RewardRule> {
    updateRewardRuleDto = plainToInstance(
      UpdateRewardRuleDto,
      updateRewardRuleDto,
      {
        excludeExtraneousValues: true,
      },
    )

    const rewardRuleEntity = plainToInstance(RewardRule, updateRewardRuleDto, {
      ignoreDecorators: true,
    })

    return await this.rewardRuleRepository.save(rewardRuleEntity)
  }

  async find(conditions: any): Promise<RewardRule[]> {
    return await this.rewardRuleRepository.find(conditions)
  }
}
