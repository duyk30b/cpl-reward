import { Entity, Column, PrimaryGeneratedColumn, AfterLoad } from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@lib/mysql/my-base.entity'
import { JsonColumnTransformer } from '@lib/mysql/typeorm.transformer'

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
  userId: number

  @Column({ name: 'success_count', default: 0 })
  @Expose({ name: 'success_count' })
  successCount: number

  @Column({ name: 'money_earned', default: 0 })
  @Expose({ name: 'money_earned' })
  moneyEarned: number

  @Column({ name: 'total_money_earned', default: 0 })
  @Expose({ name: 'total_money_earned' })
  totalMoneyEarned: number

  @Column({ name: 'referred_user_info', transformer: JsonColumnTransformer })
  @Expose({ name: 'referred_user_info' })
  referredUserInfo: string

  @AfterLoad()
  transformStringToJson() {
    this.referredUserInfo = JSON.parse(this.referredUserInfo)
  }
}
