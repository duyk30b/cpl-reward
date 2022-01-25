import { Expose } from 'class-transformer'

export class CreateCampaignDto {
  @Expose()
  name: string

  @Expose()
  active: boolean
}
