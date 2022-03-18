import { Expose, Type } from 'class-transformer'
import { ReferredUserInfoDto } from '@lib/mission-user/dto/referred-user-info.dto'

export class UpdateMissionUserDto {
  @Expose({ name: 'success_count' })
  successCount: number

  @Expose({ name: 'money_earned' })
  moneyEarned: number

  @Expose({ name: 'total_money_earned' })
  totalMoneyEarned: number

  @Expose({ name: 'referred_user_info' })
  @Type(() => ReferredUserInfoDto)
  referredUserInfo: ReferredUserInfoDto
}
