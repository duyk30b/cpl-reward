import { Expose } from 'class-transformer'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class ApiListCampaignDto {
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  page: number

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  limit: number
}
