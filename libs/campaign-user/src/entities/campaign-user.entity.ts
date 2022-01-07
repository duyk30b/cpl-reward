import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@app/mysql/my-base.entity'
import { json } from 'express'
import { JsonColumnTransformer } from '@app/mysql/typeorm.transformer'

@Entity()
export class CampaignUserEntity extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Column({ name: 'campaign_id' })
  @Expose({ name: 'campaign_id' })
  campaignId: number

  @Column({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  userId: number

  @Column({ transformer: JsonColumnTransformer })
  @Expose()
  data: string

  @Column({ name: 'success_count' })
  @Expose({ name: 'success_count' })
  successCount: number

  @Column({ name: 'money_earned' })
  @Expose({ name: 'money_earned' })
  moneyEarned: number

  @Column({ name: 'is_banned' })
  @Expose({ name: 'is_banned' })
  isBanned: boolean
}
