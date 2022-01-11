import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm'
import { Expose } from 'class-transformer'
import { TransformInt } from './decorators/transform.decorator'
import { currentUnixTime } from '@app/common/utils'

@Entity()
export class MyBaseEntity {
  @Expose({ name: 'created_at' })
  @Column({ name: 'created_at', default: null })
  @TransformInt()
  createdAt: number

  @Expose({ name: 'updated_at' })
  @Column({ name: 'updated_at', default: null })
  @TransformInt()
  updatedAt: number

  @BeforeInsert()
  beforeInsert() {
    if (!this.createdAt) {
      this.createdAt = currentUnixTime('second')
    }
    if (!this.updatedAt) {
      this.updatedAt = currentUnixTime('second')
    }
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updatedAt = currentUnixTime('second')
  }
}
