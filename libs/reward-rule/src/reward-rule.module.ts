import { Module } from '@nestjs/common'
import { RewardRuleService } from './reward-rule.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RewardRule } from '@app/reward-rule/entities/reward-rule.entity'

@Module({
  imports: [TypeOrmModule.forFeature([RewardRule])],
  providers: [RewardRuleService],
  exports: [RewardRuleService],
})
export class RewardRuleModule {}
