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
import { IS_ACTIVE_CAMPAIGN, STATUS_CAMPAIGN } from '../enum'

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

  @Column({ name: 'title_jp' })
  @Expose({ name: 'title_jp' })
  titleJp: string

  @Column({ type: 'text', default: '' })
  @Expose()
  description: string

  @Column({ name: 'description_jp', type: 'text', default: '' })
  @Expose({ name: 'description_jp' })
  descriptionJp: string

  // @Column({ name: 'detail_explain', type: 'text', default: '' })
  // @Expose({ name: 'detail_explain' })
  // detailExplain: string
  //
  // @Column({ name: 'detail_explain_jp', type: 'text', default: '' })
  // @Expose({ name: 'detail_explain_jp' })
  // detailExplainJp: string

  @Column({ name: 'start_date' })
  @Expose({ name: 'start_date' })
  startDate: number

  @Column({ name: 'end_date' })
  @Expose({ name: 'end_date' })
  endDate: number

  @Column({ name: 'notification_link', type: 'text', default: '' })
  @Expose({ name: 'notification_link' })
  notificationLink: string

  @Column({ name: 'notification_link_jp', type: 'text', default: '' })
  @Expose({ name: 'notification_link_jp' })
  notificationLinkJp: string

  @Column({ name: 'campaign_image', type: 'text', default: '' })
  @Expose({ name: 'campaign_image' })
  campaignImage: string

  @Column({ name: 'campaign_image_jp', type: 'text', default: '' })
  @Expose({ name: 'campaign_image_jp' })
  campaignImageJp: string

  @Column({ default: 0 })
  @Expose()
  priority: number

  @Column({ name: 'is_system', default: false })
  @Expose({ name: 'is_system' })
  isSystem: boolean

  @Column({
    name: 'is_active',
    type: 'smallint',
    default: IS_ACTIVE_CAMPAIGN.ACTIVE,
  })
  @Expose({ name: 'is_active' })
  isActive: number

  @Column({
    type: 'smallint',
    default: STATUS_CAMPAIGN.RUNNING,
  })
  @Expose()
  status: number

  @OneToMany(() => Mission, (mission) => mission.campaign)
  @JoinColumn()
  @Expose({
    name: 'missions',
  })
  missions: Mission[]
}