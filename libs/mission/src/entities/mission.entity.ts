import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  AfterLoad,
  ManyToOne,
} from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@lib/mysql/my-base.entity'
import { RewardRule } from '@lib/reward-rule/entities/reward-rule.entity'
import { JsonColumnTransformer } from '@lib/mysql/typeorm.transformer'
import { Campaign } from '@lib/campaign/entities/campaign.entity'
import { UserRewardHistory } from '@lib/user-reward-history/entities/user-reward-history.entity'
import { STATUS } from '../enum'

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

  @Column({ name: 'detail_explain', type: 'text', default: '' })
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
    type: 'text',
  })
  @Expose({ name: 'judgment_conditions' })
  judgmentConditions: string

  @Column({
    name: 'user_conditions',
    default: null,
    transformer: JsonColumnTransformer,
    type: 'text',
  })
  @Expose({ name: 'user_conditions' })
  userConditions: string

  @Column({
    name: 'grant_target',
    default: null,
    transformer: JsonColumnTransformer,
    type: 'text',
  })
  @Expose({ name: 'grant_target' })
  grantTarget: string

  @Column({ default: 0 })
  @Expose()
  priority: number

  @Column({
    name: 'guide_link',
    default: null,
    transformer: JsonColumnTransformer,
    type: 'text',
  })
  @Expose({ name: 'guide_link' })
  guideLink: string

  @Column({ name: 'limit_received_reward', default: 1 })
  @Expose({ name: 'limit_received_reward' })
  limitReceivedReward: number

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

  @OneToMany(
    () => UserRewardHistory,
    (userRewardHistory) => userRewardHistory.mission,
    { eager: true },
  )
  @JoinColumn()
  @Expose({
    name: 'user_reward_histories',
  })
  userRewardHistories: UserRewardHistory[]

  @Column({
    type: 'smallint',
    default: STATUS.ACTIVE,
  })
  @Expose()
  status: number

  @AfterLoad()
  transformStringToJson() {
    this.judgmentConditions = JSON.parse(this.judgmentConditions)
    this.userConditions = JSON.parse(this.userConditions)
    this.grantTarget = JSON.parse(this.grantTarget)
  }
}
