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
import { CAMPAIGN_IS_ACTIVE, CAMPAIGN_STATUS } from '../enum'
import { RewardRule } from '@lib/reward-rule/entities/reward-rule.entity'

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

  @Column({ name: 'title_ja' })
  @Expose({ name: 'title_ja' })
  titleJa: string

  @Column({ type: 'text', default: '' })
  @Expose()
  description: string

  @Column({ name: 'description_ja', type: 'text', default: '' })
  @Expose({ name: 'description_ja' })
  descriptionJa: string

  // @Column({ name: 'detail_explain', type: 'text', default: '' })
  // @Expose({ name: 'detail_explain' })
  // detailExplain: string
  //
  // @Column({ name: 'detail_explain_ja', type: 'text', default: '' })
  // @Expose({ name: 'detail_explain_ja' })
  // detailExplainJa: string

  @Column({ name: 'start_date' })
  @Expose({ name: 'start_date' })
  startDate: number

  @Column({ name: 'end_date' })
  @Expose({ name: 'end_date' })
  endDate: number

  @Column({ name: 'notification_link', type: 'text', default: '' })
  @Expose({ name: 'notification_link' })
  notificationLink: string

  @Column({ name: 'notification_link_ja', type: 'text', default: '' })
  @Expose({ name: 'notification_link_ja' })
  notificationLinkJa: string

  @Column({ name: 'campaign_image', type: 'text', default: '' })
  @Expose({ name: 'campaign_image' })
  campaignImage: string

  @Column({ name: 'campaign_image_ja', type: 'text', default: '' })
  @Expose({ name: 'campaign_image_ja' })
  campaignImageJa: string

  @Column({ default: 0 })
  @Expose()
  priority: number

  @Column({ name: 'is_system', default: false })
  @Expose({ name: 'is_system' })
  isSystem: boolean

  @Column({
    name: 'is_active',
    type: 'smallint',
    default: CAMPAIGN_IS_ACTIVE.ACTIVE,
  })
  @Expose({ name: 'is_active' })
  isActive: number

  @Column({
    type: 'smallint',
    default: CAMPAIGN_STATUS.RUNNING,
  })
  @Expose()
  status: number

  @OneToMany(() => Mission, (mission) => mission.campaign)
  @JoinColumn()
  @Expose({
    name: 'missions',
  })
  missions: Mission[]

  // @OneToMany(() => RewardRule, (rewardRule) => rewardRule.campaign, {
  //   eager: true,
  // })
  // @JoinColumn()
  @Expose({
    name: 'reward_rules',
  })
  rewardRules: RewardRule[]
}
