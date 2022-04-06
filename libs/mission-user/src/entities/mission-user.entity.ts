import { Entity, Column, PrimaryGeneratedColumn, AfterLoad } from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@lib/mysql/my-base.entity'
import { JsonColumnTransformer } from '@lib/mysql/typeorm.transformer'
import { FixedNumber } from 'ethers'

@Entity({
  name: 'mission_user',
})
export class MissionUser extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Column({ name: 'mission_id' })
  @Expose({ name: 'mission_id' })
  missionId: number

  @Column({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  userId: string

  @Column({ name: 'success_count', default: 0 })
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

  @Column({
    type: 'decimal',
    precision: 49,
    scale: 18,
    nullable: true,
    default: 0,
    name: 'total_money_earned',
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
    name: 'total_money_earned',
  })
  totalMoneyEarned: number

  @Column({ name: 'referred_user_info', transformer: JsonColumnTransformer })
  @Expose({ name: 'referred_user_info' })
  referredUserInfo: string

  @AfterLoad()
  transformStringToJson() {
    if (this.referredUserInfo !== undefined)
      this.referredUserInfo = JSON.parse(this.referredUserInfo)
  }
}
