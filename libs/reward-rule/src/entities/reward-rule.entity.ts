import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@lib/mysql/my-base.entity'
import { Mission } from '@lib/mission/entities/mission.entity'
import { KEY_REWARD_RULE, TYPE_RULE } from '../enum'
import { FixedNumber } from 'ethers'

@Entity({
  name: 'reward_rules',
})
export class RewardRule extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Column({ name: 'campaign_id' })
  @Expose({ name: 'campaign_id' })
  campaignId: number

  @Column({
    nullable: true,
    default: null,
    name: 'mission_id',
  })
  @Expose({ name: 'mission_id' })
  missionId: number

  @Column({
    name: 'type_rule',
    type: 'enum',
    enum: TYPE_RULE,
    default: TYPE_RULE.CAMPAIGN,
  })
  @Expose({ name: 'type_rule' })
  typeRule: TYPE_RULE

  @Column({
    type: 'enum',
    enum: KEY_REWARD_RULE,
    default: KEY_REWARD_RULE.BALANCE,
  })
  @Expose()
  key: KEY_REWARD_RULE

  @Column()
  @Expose()
  currency: string

  @Column({
    type: 'decimal',
    precision: 49,
    scale: 18,
    nullable: true,
    default: 0,
    name: 'limit_value',
    transformer: {
      to: (value) => {
        if (value !== undefined && typeof value === 'string') {
          return FixedNumber.fromString(value).toUnsafeFloat()
        }
        return value
      },
      from: (value) => value,
    },
  })
  @Expose({
    name: 'limit_value',
  })
  limitValue: number

  @Column({
    type: 'decimal',
    precision: 49,
    scale: 18,
    nullable: true,
    default: 0,
    name: 'release_value',
    transformer: {
      to: (value) => {
        if (value !== undefined && typeof value === 'string') {
          return FixedNumber.fromString(value).toUnsafeFloat()
        }
        return value
      },
      from: (value) => value,
    },
  })
  @Expose({
    name: 'release_value',
  })
  releaseValue: number

  @ManyToOne(() => Mission, (mission) => mission.rewardRules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'mission_id' })
  mission: Mission
}
