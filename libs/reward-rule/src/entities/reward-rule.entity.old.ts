import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@lib/mysql/my-base.entity'
import { CampaignEntityOld } from '@lib/campaign/entities/campaign.entity.old'
import { Mission } from '@lib/mission/entities/mission.entity'
import { KEY_REWARD_RULE, TYPE_RULE } from '../enum'

@Entity({
  name: 'reward_rules',
})
export class RewardRuleEntityOld extends MyBaseEntity {
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
    precision: 24,
    scale: 18,
    nullable: true,
    default: 0,
    name: 'limit_value',
  })
  @Expose({
    name: 'limit_value',
  })
  limitValue: number

  @Column({
    type: 'decimal',
    precision: 24,
    scale: 18,
    nullable: true,
    default: 0,
    name: 'release_value',
  })
  @Expose({
    name: 'release_value',
  })
  releaseValue: number

  @ManyToOne(() => CampaignEntityOld, (campaign) => campaign.rewardRules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'campaign_id' })
  campaign: CampaignEntityOld

  @ManyToOne(() => Mission, (mission) => mission.rewardRules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'mission_id' })
  mission: Mission
}
