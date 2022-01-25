import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ApiCreateMissionDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  active: boolean

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  currency: string

  @ApiProperty({ name: 'start_date' })
  @Expose({ name: 'start_date' })
  @IsNotEmpty()
  startDate: number

  @ApiProperty({ name: 'end_date' })
  @Expose({ name: 'end_date' })
  @IsNotEmpty()
  endDate: number

  @ApiProperty({ name: 'limit_user_reward' })
  @Expose({ name: 'limit_user_reward' })
  @IsNotEmpty()
  limitUserReward: number

  @ApiProperty({ name: 'limit_user_money' })
  @Expose({ name: 'limit_user_money' })
  @IsNotEmpty()
  limitUserMoney: number

  @ApiProperty({ name: 'limit_system_reward' })
  @Expose({ name: 'limit_system_reward' })
  @IsNotEmpty()
  limitSystemReward: number

  @ApiProperty({ name: 'limit_system_money' })
  @Expose({ name: 'limit_system_money' })
  @IsNotEmpty()
  limitSystemMoney: number

  @ApiProperty({ name: 'prepare_data_required' })
  @Expose({ name: 'prepare_data_required' })
  prepareDataRequired: boolean
}
