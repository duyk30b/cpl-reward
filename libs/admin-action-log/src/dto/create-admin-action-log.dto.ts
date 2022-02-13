import { Expose } from 'class-transformer'

export class CreateAdminActionLogDto {
  @Expose()
  adminId: number

  @Expose()
  actionName: string

  @Expose()
  contentData: string
}
