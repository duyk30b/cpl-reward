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

  @Column({ name: 'judgment_conditions', default: null })
  @Expose({ name: 'judgment_conditions' })
  judgmentConditions: string

  @Column({ name: 'user_conditions', default: null })
  @Expose({ name: 'user_conditions' })
  userConditions: string

  @Column({ name: 'grant_target', default: null })
  @Expose({ name: 'grant_target' })
  grantTarget: string
}
