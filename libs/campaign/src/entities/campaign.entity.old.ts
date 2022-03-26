import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@lib/mysql/my-base.entity'
import { Mission } from '@lib/mission/entities/mission.entity'
import { STATUS } from '../enum'
import { RewardRuleEntityOld } from '@lib/reward-rule/entities/reward-rule.entity.old'

@Entity({
  name: 'campaigns',
})
export class CampaignEntityOld extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Column()
  @Expose()
  title: string

  @Column({ type: 'text', default: '' })
  @Expose()
  description: string

  @Column({ name: 'detail_explain', type: 'text', default: '' })
  @Expose({ name: 'detail_explain' })
  detailExplain: string

  @Column({ name: 'start_date' })
  @Expose({ name: 'start_date' })
  startDate: number

  @Column({ name: 'end_date' })
  @Expose({ name: 'end_date' })
  endDate: number

  @Column({ name: 'notification_link', type: 'text', default: '' })
  @Expose({ name: 'notification_link' })
  notificationLink: string

  @Column({ name: 'campaign_image', type: 'text', default: '' })
  @Expose({ name: 'campaign_image' })
  campaignImage: string

  @Column({ default: 0 })
  @Expose()
  priority: number

  @Column({ name: 'is_system', default: false })
  @Expose({ name: 'is_system' })
  isSystem: boolean

  @Column({
    type: 'tinyint',
    default: STATUS.ACTIVE,
  })
  @Expose()
  status: number

  @OneToMany(() => RewardRuleEntityOld, (rewardRule) => rewardRule.campaign, {
    eager: true,
  })
  @JoinColumn()
  @Expose({
    name: 'reward_rules',
  })
  rewardRules: RewardRuleEntityOld[]

  @OneToMany(() => Mission, (mission) => mission.campaign)
  @JoinColumn()
  @Expose({
    name: 'missions',
  })
  missions: Mission[]
}
