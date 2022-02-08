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
import { Mission } from '@app/mission/entities/mission.entity'

@Entity({
  name: 'campaigns',
})
export class Campaign extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Column({
    nullable: true,
    default: null,
  })
  @Expose()
  title: string

  @Column({
    nullable: true,
    default: null,
  })
  @Expose()
  description: string

  @Column({
    nullable: true,
    default: null,
    name: 'detail_explain',
  })
  @Expose({
    name: 'detail_explain',
  })
  detailExplain: string

  @Column({
    nullable: true,
    default: null,
    name: 'start_date',
  })
  @Expose({
    name: 'start_date',
  })
  startDate: number

  @Column({
    nullable: true,
    default: null,
    name: 'end_date',
  })
  @Expose({
    name: 'end_date',
  })
  endDate: number

  @Column({
    nullable: true,
    default: null,
    name: 'notification_link',
  })
  @Expose({
    name: 'notification_link',
  })
  notificationLink: string

  @Column({
    nullable: true,
    default: null,
    name: 'campaign_image',
  })
  @Expose({
    name: 'campaign_image',
  })
  campaignImage: string

  @OneToMany(() => RewardRule, (rewardRule) => rewardRule.campaign)
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
