import { MyBaseEntity } from '@app/mysql/my-base.entity'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'

@Entity({
  name: 'admin_action_logs',
})
export class AdminActionLog extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Column({ name: 'admin_id' })
  @Expose({ name: 'admin_id' })
  adminId: number

  @Column({ name: 'action_name' })
  @Expose({ name: 'action_name' })
  actionName: string

  @Column({ name: 'content_data' })
  @Expose({ name: 'content_data' })
  contentData: string
}
