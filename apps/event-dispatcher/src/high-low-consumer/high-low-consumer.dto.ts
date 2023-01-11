import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class HighLowResultMessageDto {
  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  userId: string
}
