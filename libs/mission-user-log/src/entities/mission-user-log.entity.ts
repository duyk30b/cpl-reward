import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@lib/mysql/my-base.entity'
import { FixedNumber } from 'ethers'
import { GRANT_TARGET_USER } from '@lib/mission'

@Entity({
  name: 'mission_user_logs',
})
export class MissionUserLog extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Column({ name: 'mission_id' })
  @Expose({ name: 'mission_id' })
  missionId: number

  @Column({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  userId: string

  @Column({ name: 'success_count' })
  @Expose({ name: 'success_count' })
  successCount: number

  @Column({
    type: 'decimal',
    precision: 49,
    scale: 18,
    nullable: true,
    default: 0,
    name: 'money_earned',
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
  @Expose({
    name: 'money_earned',
  })
  moneyEarned: number

  @Column()
  @Expose()
  note: string

  @Column({
    name: 'user_type',
    type: 'enum',
    enum: GRANT_TARGET_USER,
    default: GRANT_TARGET_USER.USER,
  })
  @Expose({ name: 'user_type' })
  userType: GRANT_TARGET_USER

  @Column()
  @Expose()
  currency: string
}
