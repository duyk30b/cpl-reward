import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@app/mysql/my-base.entity'
import { Campaign } from '@app/campaign/entities/campaign.entity'
import { Mission } from '@app/mission/entities/mission.entity'

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
  @Expose({
    name: 'mission_id',
  })
  missionId: number

  @Column({ name: 'type_rule' })
  @Expose({ name: 'type_rule' })
  typeRule: string

  @Column()
  @Expose()
  key: string

  @Column()
  @Expose()
  currency: string

  @Column({
    nullable: true,
    default: null,
    name: 'limit_value',
  })
  @Expose({
    name: 'limit_value',
  })
  limitValue: number

  @Column({
    nullable: true,
    default: null,
    name: 'release_value',
  })
  @Expose({
    name: 'release_value',
  })
  releaseValue: number

  @ManyToOne(() => Campaign, (campaign) => campaign.rewardRules)
  @JoinColumn({ name: 'campaign_id' })
  campaign: Campaign

  @ManyToOne(() => Mission, (mission) => mission.rewardRules)
  @JoinColumn({ name: 'mission_id' })
  mission: Mission
}
