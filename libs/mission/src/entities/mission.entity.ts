import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@app/mysql/my-base.entity'

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
  name: string

  @Column()
  @Expose()
  active: boolean

  @Column()
  @Expose()
  currency: number

  @Column({ name: 'start_date' })
  @Expose({ name: 'start_date' })
  startDate: number

  @Column({ name: 'end_date' })
  @Expose({ name: 'end_date' })
  endDate: number

  @Column({ name: 'limit_user_reward' })
  @Expose({ name: 'limit_user_reward' })
  limitUserReward: number

  @Column({ name: 'limit_user_money' })
  @Expose({ name: 'limit_user_money' })
  limitUserMoney: number

  @Column({ name: 'limit_system_reward' })
  @Expose({ name: 'limit_system_reward' })
  limitSystemReward: number

  @Column({ name: 'limit_system_money' })
  @Expose({ name: 'limit_system_money' })
  limitSystemMoney: number

  @Column({ name: 'released_reward' })
  @Expose({ name: 'released_reward' })
  releasedReward: number

  @Column({ name: 'released_money' })
  @Expose({ name: 'released_money' })
  releasedMoney: number

  @Column({ name: 'prepare_data_required' })
  @Expose({ name: 'prepare_data_required' })
  prepareDataRequired: boolean

  @Column({ name: 'prepare_data_done' })
  @Expose({ name: 'prepare_data_done' })
  prepareDataDone: boolean
}
