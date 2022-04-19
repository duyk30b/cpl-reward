import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RewardRule } from '@lib/reward-rule/entities/reward-rule.entity'
import { CreateRewardRuleDto } from '@lib/reward-rule/dto/create-reward-rule.dto'
import { plainToInstance } from 'class-transformer'
import { UpdateRewardRuleDto } from '@lib/reward-rule/dto/update-reward-rule.dto'
import { OptionalRewardRule } from '@lib/reward-rule/reward-rule.interface'

@Injectable()
export class RewardRuleService {
  constructor(
    @InjectRepository(RewardRule)
    private rewardRuleRepository: Repository<RewardRule>,
  ) {}

  async create(
    createRewardRule: CreateRewardRuleDto,
    optionalRewardRule: OptionalRewardRule,
  ): Promise<RewardRule> {
    createRewardRule.campaignId = optionalRewardRule.campaignId
    createRewardRule.missionId = optionalRewardRule.missionId
    createRewardRule.typeRule = optionalRewardRule.typeRule

    const rewardRuleEntity = plainToInstance(RewardRule, createRewardRule, {
      ignoreDecorators: true,
    })
    return await this.rewardRuleRepository.save(rewardRuleEntity)
  }

  async update(
    updateRewardRuleDto: UpdateRewardRuleDto,
    optionalRewardRule: OptionalRewardRule,
  ): Promise<RewardRule> {
    updateRewardRuleDto.campaignId = optionalRewardRule.campaignId
    updateRewardRuleDto.missionId = optionalRewardRule.missionId
    updateRewardRuleDto.typeRule = optionalRewardRule.typeRule

    const rewardRuleEntity = plainToInstance(RewardRule, updateRewardRuleDto, {
      ignoreDecorators: true,
    })

    return await this.rewardRuleRepository.save(rewardRuleEntity)
  }

  async find(conditions: any): Promise<RewardRule[]> {
    return await this.rewardRuleRepository.find(conditions)
  }

  async findOne(conditions: any): Promise<RewardRule> {
    return await this.rewardRuleRepository.findOne(conditions)
  }

  async updateValue(
    rewardRuleId: number,
    newReleaseValue: number,
    amount: number,
  ) {
    // TODO: Câu query bị sai do limitValue là string, phép trừ bị sai
    // Phải quay ngược lại chỗ gọi hàm .updateValue đưa hết vào transaction
    // Nếu transaction ko thành công cần ghi log để user ko bị mất tiền oan
    return await this.rewardRuleRepository
      .createQueryBuilder('reward_rule')
      .update(RewardRule)
      .where('id = :id', { id: rewardRuleId })
      .andWhere('(limitValue - releaseValue) >= :amount', {
        amount: amount,
      })
      .set({
        releaseValue: newReleaseValue,
      })
      .execute()
  }

  async onlyUpdate(updateRewardRule: RewardRule): Promise<RewardRule> {
    return await this.rewardRuleRepository.save(updateRewardRule)
  }
}
