import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@app/mysql/my-base.entity'
import { RewardRule } from '@app/reward-rule/entities/reward-rule.entity'
import { JsonColumnTransformer } from '@app/mysql/typeorm.transformer'

@Entity({
  name: 'missions',
})
export class Mission extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Column({ name: 'campaign_id' })
  @Expose({ name: 'campaign_id' })
  campaignId: number

  @Column()
  @Expose()
  title: string

  @Column({ name: 'detail_explain' })
  @Expose({ name: 'detail_explain' })
  detailExplain: string

  @Column({ name: 'opening_date' })
  @Expose({ name: 'opening_date' })
  openingDate: number

  @Column({ name: 'closing_date' })
  @Expose({ name: 'closing_date' })
  closingDate: number

  @Column({
    name: 'judgment_conditions',
    default: null,
    transformer: JsonColumnTransformer,
  })
  @Expose({ name: 'judgment_conditions' })
  judgmentConditions: string

  @Column({
    name: 'user_conditions',
    default: null,
    transformer: JsonColumnTransformer,
  })
  @Expose({ name: 'user_conditions' })
  userConditions: string

  @Column({
    name: 'grant_target',
    default: null,
    transformer: JsonColumnTransformer,
  })
  @Expose({ name: 'grant_target' })
  grantTarget: string

  @OneToMany(() => RewardRule, (rewardRule) => rewardRule.mission)
  @JoinColumn()
  @Expose({
    name: 'reward_rules',
  })
  rewardRules: RewardRule[]
}
