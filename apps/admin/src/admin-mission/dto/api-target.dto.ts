import { Expose } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class ApiTargetDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  user: string

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  amount: number

  @Expose()
  @IsNotEmpty()
  @IsString()
  currency: string

  @Expose()
  @IsNotEmpty()
  @IsString()
  wallet: string
}
