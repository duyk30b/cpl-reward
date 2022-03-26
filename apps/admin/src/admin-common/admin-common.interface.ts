import { Expose } from 'class-transformer'

export class CreateActionLogInput {
  @Expose({ name: 'admin_id' })
  adminId: number
  @Expose({ name: 'action_name' })
  actionName: string
  @Expose({ name: 'content_date' })
  contentData: string
}
