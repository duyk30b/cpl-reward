import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  AfterLoad,
  ManyToOne,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@lib/mysql/my-base.entity'
import { RewardRule } from '@lib/reward-rule/entities/reward-rule.entity'
import { JsonColumnTransformer } from '@lib/mysql/typeorm.transformer'
import { Campaign } from '@lib/campaign/entities/campaign.entity'

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

  @OneToMany(() => RewardRule, (rewardRule) => rewardRule.mission, {
    eager: true,
  })
  @JoinColumn()
  @Expose({
    name: 'reward_rules',
  })
  rewardRules: RewardRule[]

  @ManyToOne(() => Campaign, (campaign) => campaign.missions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'campaign_id' })
  campaign: Campaign

  @AfterLoad()
  transformStringToJson() {
    this.judgmentConditions = JSON.parse(this.judgmentConditions)
    this.userConditions = JSON.parse(this.userConditions)
    this.grantTarget = JSON.parse(this.grantTarget)
  }

  @BeforeInsert()
  @BeforeUpdate()
  transformJsonToString() {
    this.judgmentConditions = JSON.stringify(this.judgmentConditions)
    this.userConditions = JSON.stringify(this.userConditions)
    this.grantTarget = JSON.stringify(this.grantTarget)
  }
}
