import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@lib/mysql/my-base.entity'
import { GRANT_TARGET_USER, GRANT_TARGET_WALLET } from '@lib/mission'
import { STATUS } from '@lib/user-reward-history/enum'

@Entity({
  name: 'user_reward_histories',
})
export class UserRewardHistory extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Column({ name: 'campaign_id' })
  @Expose({ name: 'campaign_id' })
  campaignId: number

  @Column({ name: 'mission_id' })
  @Expose({ name: 'mission_id' })
  missionId: number

  @Column({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  userId: number

  @Column({
    name: 'user_type',
    type: 'enum',
    enum: GRANT_TARGET_USER,
    default: GRANT_TARGET_USER.USER,
  })
  @Expose({ name: 'user_type' })
  userType: string

  @Column()
  @Expose()
  amount: number

  @Column()
  @Expose()
  currency: string

  @Column({
    type: 'enum',
    enum: GRANT_TARGET_WALLET,
    default: GRANT_TARGET_WALLET.REWARD_BALANCE,
  })
  @Expose()
  wallet: string

  @Column({
    type: 'enum',
    enum: STATUS,
    default: STATUS.NOT_RECEIVE,
  })
  @Expose()
  status: string
}
