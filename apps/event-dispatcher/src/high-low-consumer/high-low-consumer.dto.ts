import { Expose, Type } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class HighLowMessageDto {
  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  @Type(() => String)
  userId: string
}
