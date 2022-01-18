import { Expose } from 'class-transformer'

export class CreateCampaignGroupDto {
  @Expose()
  name: string

  @Expose()
  active: boolean
}
