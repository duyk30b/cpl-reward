import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@lib/mysql/my-base.entity'
import { USER_REWARD_STATUS } from '@lib/user-reward-history/enum'

import { Mission } from '@lib/mission/entities/mission.entity'
import { GRANT_TARGET_USER, WALLET, DELIVERY_METHOD } from '@lib/mission/enum'
import { FixedNumber } from 'ethers'

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
  userId: string

  @Column({
    name: 'user_type',
    type: 'enum',
    enum: GRANT_TARGET_USER,
    default: GRANT_TARGET_USER.USER,
  })
  @Expose({ name: 'user_type' })
  userType: GRANT_TARGET_USER

  @Column({
    type: 'decimal',
    precision: 49,
    scale: 18,
    nullable: true,
    default: 0,
    transformer: {
      to: (value) => {
        if (value !== undefined && typeof value === 'string') {
          return FixedNumber.fromString(value).toUnsafeFloat()
        }
        return value
      },
      from: (value) => value,
    },
  })
  @Expose()
  amount: number

  @Column()
  @Expose()
  currency: string

  @Column({
    type: 'smallint',
    enum: WALLET,
    default: WALLET.BALANCE,
  })
  @Expose()
  wallet: number

  @Column({
    name: 'delivery_method',
    type: 'smallint',
    enum: DELIVERY_METHOD,
    default: DELIVERY_METHOD.AUTO,
  })
  @Expose({ name: 'delivery_method' })
  deliveryMethod: number

  @Column({
    type: 'smallint',
    default: USER_REWARD_STATUS.NOT_RECEIVE,
  })
  @Expose()
  status: number

  @Column({ name: 'referrer_user_id', default: null })
  @Expose({ name: 'referrer_user_id' })
  referrerUserId: string

  @ManyToOne(() => Mission, (mission) => mission.userRewardHistories)
  @JoinColumn({ name: 'mission_id' })
  mission: Mission
}
