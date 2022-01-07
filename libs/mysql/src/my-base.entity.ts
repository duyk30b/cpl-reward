import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm'
import { Expose } from 'class-transformer'
import { TransformInt } from './decorators/transform.decorator'

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
      this.createdAt = new Date().getTime()
    }
    if (!this.updatedAt) {
      this.updatedAt = new Date().getTime()
    }
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updatedAt = new Date().getTime()
  }
}
