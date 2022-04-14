import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@lib/mysql/my-base.entity'
import { GRANT_TARGET_USER } from '@lib/mission'

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
    name: 'user_type',
    type: 'enum',
    enum: GRANT_TARGET_USER,
    default: GRANT_TARGET_USER.USER,
  })
  @Expose({ name: 'user_type' })
  userType: GRANT_TARGET_USER
}
