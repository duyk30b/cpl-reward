import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@lib/mysql/my-base.entity'
import { Campaign } from '@lib/campaign/entities/campaign.entity'

export enum EVENTS {
  NONE = '',
  AUTH_USER_LOGIN = 'auth_user_login',
}

@Entity({
  name: 'mission_event',
})
export class MissionEvent extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Column({ name: 'mission_id' })
  @Expose({ name: 'mission_id' })
  missionId: number

  @Column({ name: 'campaign_id' })
  @Expose({ name: 'campaign_id' })
  campaignId: number

  @Column({
    name: 'event_name',
    type: 'enum',
    enum: EVENTS,
    default: EVENTS.NONE,
  })
  @Expose({ name: 'event_name' })
  eventName: EVENTS

  @ManyToOne(() => Campaign, (campaign) => campaign.rewardRules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'campaign_id' })
  campaign: Campaign
}
