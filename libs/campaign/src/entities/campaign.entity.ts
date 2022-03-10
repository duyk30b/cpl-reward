import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@lib/mysql/my-base.entity'
import { RewardRule } from '@lib/reward-rule/entities/reward-rule.entity'
import { Mission } from '@lib/mission/entities/mission.entity'
import { STATUS } from '../enum'

@Entity({
  name: 'campaigns',
})
export class Campaign extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Column()
  @Expose()
  title: string

  @Column()
  @Expose()
  description: string

  @Column({ name: 'detail_explain', default: '' })
  @Expose({ name: 'detail_explain' })
  detailExplain: string

  @Column({ name: 'start_date' })
  @Expose({ name: 'start_date' })
  startDate: number

  @Column({ name: 'end_date' })
  @Expose({ name: 'end_date' })
  endDate: number

  @Column({ name: 'notification_link', default: '' })
  @Expose({ name: 'notification_link' })
  notificationLink: string

  @Column({ name: 'campaign_image', default: '' })
  @Expose({ name: 'campaign_image' })
  campaignImage: string

  @Column({ default: 0 })
  @Expose()
  priority: number

  @Column({ name: 'is_system', default: false })
  @Expose({ name: 'is_system' })
  isSystem: boolean

  @Column({
    type: 'enum',
    enum: STATUS,
    default: STATUS.ACTIVE,
  })
  @Expose()
  status: STATUS

  @OneToMany(() => RewardRule, (rewardRule) => rewardRule.campaign, {
    eager: true,
  })
  @JoinColumn()
  @Expose({
    name: 'reward_rules',
  })
  rewardRules: RewardRule[]

  @OneToMany(() => Mission, (mission) => mission.campaign)
  @JoinColumn()
  @Expose({
    name: 'missions',
  })
  missions: Mission[]
}
